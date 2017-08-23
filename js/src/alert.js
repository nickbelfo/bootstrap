import Data from './dom/data'
import EventHandler from './dom/eventHandler'
import SelectorEngine from './dom/selectorEngine'
import Util from './util'


/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta): alert.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Alert = (() => {


  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME                = 'alert'
  const VERSION             = '4.0.0-beta'
  const DATA_KEY            = 'bs.alert'
  const EVENT_KEY           = `.${DATA_KEY}`
  const DATA_API_KEY        = '.data-api'
  const JQUERY_NO_CONFLICT  = $.fn[NAME]
  const TRANSITION_DURATION = 150

  const Selector = {
    DISMISS : '[data-dismiss="alert"]'
  }

  const Event = {
    CLOSE          : `close${EVENT_KEY}`,
    CLOSED         : `closed${EVENT_KEY}`,
    CLICK_DATA_API : `click${EVENT_KEY}${DATA_API_KEY}`
  }

  const ClassName = {
    ALERT : 'alert',
    FADE  : 'fade',
    SHOW  : 'show'
  }


  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Alert {

    constructor(element) {
      this._element = element
    }


    // getters

    static get VERSION() {
      return VERSION
    }


    // public

    close(element) {
      element = element || this._element

      const rootElement = this._getRootElement(element)
      const customEvent = this._triggerCloseEvent(rootElement)

      if (customEvent.defaultPrevented) {
        return
      }

      this._removeElement(rootElement)
    }

    dispose() {
      Data.removeData(this._element, DATA_KEY)
      this._element = null
    }


    // private

    _getRootElement(element) {
      const selector = Util.getSelectorFromElement(element)
      let parent     = false

      if (selector) {
        const tmpSelected = SelectorEngine.find(selector)
        parent = tmpSelected[0]
      }

      if (!parent) {
        parent = SelectorEngine.closest(element, `.${ClassName.ALERT}`)
      }

      return parent
    }

    _triggerCloseEvent(element) {
      return EventHandler.trigger(element, Event.CLOSE)
    }

    _removeElement(element) {
      element.classList.remove(ClassName.SHOW)

      if (!Util.supportsTransitionEnd() ||
          !element.classList.contains(ClassName.FADE)) {
        this._destroyElement(element)
        return
      }

      EventHandler
        .one(element, Util.TRANSITION_END, (event) => this._destroyElement(element, event))
      Util.emulateTransitionEnd(element, TRANSITION_DURATION)
    }

    _destroyElement(element) {
      EventHandler.trigger(element, Event.CLOSED)
      element.parentNode.removeChild(element)
    }


    // static

    static _jQueryInterface(config) {
      return this.each(function () {
        let data = Data.getData(this, DATA_KEY)

        if (!data) {
          data = new Alert(this)
          Data.setData(this, DATA_KEY, data)
        }

        if (config === 'close') {
          data[config](this)
        }
      })
    }

    static _handleDismiss(alertInstance) {
      return function (event) {
        if (event) {
          event.preventDefault()
        }

        alertInstance.close(this)
      }
    }

  }


  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */
  EventHandler.on(document, Event.CLICK_DATA_API, Selector.DISMISS, Alert._handleDismiss(new Alert()))


  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .alert to jQuery only if jQuery is present
   */

  if (typeof $ !== 'undefined') {
    $.fn[NAME]             = Alert._jQueryInterface
    $.fn[NAME].Constructor = Alert
    $.fn[NAME].noConflict  = function () {
      $.fn[NAME] = JQUERY_NO_CONFLICT
      return Alert._jQueryInterface
    }
  }

  return Alert

})()

export default Alert
