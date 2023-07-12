import { LANGUAGES, settings, TEXTS, Toolbox, TYPES } from "./constants";
import {
  createButton,
  createIconButton,
  createLoader,
  renderSettings,
  renderVariants,
} from "./utils";
import "./index.scss";
import "./loader.css";

class Quiz {
  #answers = new Set();
  #variants = [{ value: 0, text: "" }];
  #type = "singleSelect";
  #language = "uz";

  constructor(args) {
    const { data, block, readOnly, config, api } = args;
    this.data = data;
    this.readOnly = readOnly ?? false;
    this.config = config;
    this.block = block;
    this.api = api;
    this.settings = settings;

    if (Array.isArray(data?.variants))
      this.#variants = Array.from(data.variants);
    if (Array.isArray(data?.answers) && !readOnly) {
      this.#answers = new Set(data.answers);
    }
    if (typeof data?.type === "string") this.#type = data.type;
    if (LANGUAGES.includes(config.language)) this.#language = config.language;

    // creating container
    this.container = document.createElement("div");
    this.container.className = "quiz-tool-container";
    // adding body
    this.body = document.createElement("form");
    this.container.appendChild(this.body);
    // adding footer
    this.footer = document.createElement("div");
    this.container.appendChild(this.footer);
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get enableLineBreaks() {
    return true;
  }

  static get toolbox() {
    return Toolbox;
  }

  render() {
    this._renderBody();
    this._renderFooter();

    return this.container;
  }

  renderSettings = () => {
    return renderSettings(this.settings, this._changeType, this);
  };

  _changeType = (setting) => {
    if (setting.type !== this.#type) {
      this.#type = setting.type;
      this.#answers = new Set();
      this._renderVariants();
    }
  };

  _addVariant = (index) => {
    const newVariant = { value: this.#variants.length, text: "" };
    if (index) {
      this.#variants = this.#variants
        .slice(0, index)
        .concat([newVariant])
        .concat(this.#variants.slice(index));
    } else {
      this.#variants.push({ value: this.#variants.length, text: "" });
    }
    this._renderVariants({ autoFocus: true, focusIndex: index });
  };

  _deleteVariant = (index) => {
    this.#variants[index] = null;
    this.#variants = this.#variants.filter(Boolean);
    this._renderVariants();
  };

  _renderVariants(config) {
    const { autoFocus = false, focusIndex } = config || {};
    const variantsContainer = renderVariants(this.#variants, this.#type, this);
    this.body.innerHTML = "";
    this.body.appendChild(variantsContainer);

    if (autoFocus) {
      let focusingItem = null;
      if (focusIndex) {
        const variants = variantsContainer.children;
        focusingItem = variants[focusIndex];
      } else {
        focusingItem = variantsContainer.lastElementChild;
      }
      const focusingItemParagraph = focusingItem.querySelector("p");
      focusingItemParagraph.focus();
    }
  }

  _renderBody() {
    this._renderVariants();
  }

  _renderError(message) {
    let error = this.body.querySelector(".cdx-quiz-error");
    if (error) {
      error.innerText = message;
      return;
    }
    error = document.createElement("div");
    error.className = "cdx-quiz-error";
    error.innerText = message;
    this.body.appendChild(error);
  }

  _clearError() {
    const error = this.body.querySelector(".cdx-quiz-error");
    error && error.remove();
  }

  _renderFooter() {
    this.footer.className = "quiz-footer";

    const buttons = document.createDocumentFragment();
    if (this.readOnly) {
      const submitBtn = createButton();
      const submitText = TEXTS[this.#language].footer.submit;
      submitBtn.innerText = submitText;

      submitBtn.onclick = async () => {
        if (this.#answers.size === 0) {
          this._renderError(TEXTS[this.#language].errors.required);
        } else {
          const loader = createLoader();
          submitBtn.innerText = "";
          submitBtn.appendChild(loader);

          try {
            await this.config.onSubmit({
              id: this.block.id,
              selectedVariants: Array.from(this.#answers),
            });
          } catch (e) {
            console.error(e);
          }

          submitBtn.innerText = submitText;
        }
      };
      buttons.appendChild(submitBtn);
    } else {
      const addVariantBtn = createButton();
      addVariantBtn.classList.add("qt-add-btn");
      addVariantBtn.innerText = "+";
      addVariantBtn.onclick = () => this._addVariant();
      buttons.appendChild(addVariantBtn);
    }

    this.footer.innerHTML = "";
    this.footer.appendChild(buttons);
  }

  _variantInputChangeHandler = (event) => {
    event.stopPropagation()
    const value = Number(event.target.value);
    const checked = event.target.checked;

    // if input is unchecked remove the value from the answers
    if (!checked) {
      this.#answers.delete(value);
      return;
    }

    // add the value to the answers
    if (this.#type === TYPES.singleSelect) {
      this.#answers = new Set([value]);
    } else {
      this.#answers.add(value);
    }
    this._clearError();
  };

  _variantTextChangeHandler = (event, index) => {
    this.#variants[index] = {
      ...this.#variants[index],
      text: event.target.innerHTML,
    };
  };

  save() {
    return {
      variants: this.#variants,
      answers: Array.from(this.#answers),
      type: this.#type,
    };
  }

  getAnswers = () => {
    return this.#answers;
  };
}

export default Quiz;
