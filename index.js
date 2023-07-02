import { LANGUAGES, settings, TEXTS, Toolbox, TYPES } from "./constants";
import {
  createButton,
  createIconButton,
  renderSettings,
  renderVariants,
} from "./utils";
import "./index.css";

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
    this.#type = setting.type;
    this.#answers = new Set();
    this._renderVariants();
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

  _renderFooter() {
    this.footer.className = "quiz-footer";

    const buttons = document.createElement("div");
    if (this.readOnly) {
      const submitBtn = createButton();
      submitBtn.innerText = TEXTS[this.#language].footer.submit;
      submitBtn.disabled = this.#answers.size === 0;
      submitBtn.onclick = () => {
        this.config.onSubmit({
          id: this.block.id,
          selectedVariants: this.#answers,
        });
      };
      buttons.appendChild(submitBtn);
    } else {
      const addVariantBtn = createIconButton({ size: "medium" });
      addVariantBtn.innerText = "+";
      addVariantBtn.onclick = () => this._addVariant();
      buttons.appendChild(addVariantBtn);
    }

    this.footer.innerHTML = "";
    this.footer.appendChild(buttons);
  }

  _variantInputChangeHandler = (event) => {
    const value = Number(event.target.value);
    const checked = event.target.checked;

    // if input is unchecked remove the value from the answers
    if (!checked) {
      this.#answers.delete(value);
      // render footer for enabling/disabling submit button
      this.readOnly && this._renderFooter();
      return;
    }

    // add the value to the answers
    if (this.#type === TYPES.singleSelect) {
      this.#answers = [value];
    } else {
      this.#answers.add(value);
    }
    // render footer for enabling/disabling submit button
    this.readOnly && this._renderFooter();
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
