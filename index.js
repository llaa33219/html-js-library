/**
 * HTML-JS Library
 * HTML 태그로 JavaScript 기능을 구현할 수 있게 해주는 라이브러리
 * 사용법: <script src="html-js-library.js"></script>
 */
(function() {
    'use strict';

    class HTMLJSLibrary {
        constructor() {
            this.functions = {};
            this.variables = {};
            this.init();
        }

        init() {
            // DOM이 로드되면 초기화
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.parseAndExecute());
            } else {
                this.parseAndExecute();
            }

            // 동적으로 추가되는 요소들 감지
            this.observeChanges();
        }

        observeChanges() {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                this.parseElement(node);
                            }
                        });
                    }
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        parseAndExecute() {
            // 모든 커스텀 태그들 찾아서 처리
            const elements = document.querySelectorAll('function, variable, addEventListener, call, if, for, while, getElementById, querySelector, querySelectorAll, set, get, create, append, remove, show, hide, toggle, alert, confirm, prompt, log');
            
            elements.forEach(element => this.parseElement(element));
        }

        parseElement(element) {
            if (!element.tagName) return;

            switch(element.tagName.toLowerCase()) {
                case 'function':
                    this.parseFunction(element);
                    break;
                case 'variable':
                    this.parseVariable(element);
                    break;
                case 'addeventlistener':
                    this.parseEventListener(element);
                    break;
                case 'call':
                    this.parseCall(element);
                    break;
                case 'if':
                    this.parseIf(element);
                    break;
                case 'for':
                    this.parseFor(element);
                    break;
                case 'while':
                    this.parseWhile(element);
                    break;
                case 'getelementbyid':
                    this.parseGetElementById(element);
                    break;
                case 'queryselector':
                    this.parseQuerySelector(element);
                    break;
                case 'queryselectorall':
                    this.parseQuerySelectorAll(element);
                    break;
                case 'set':
                    this.parseSet(element);
                    break;
                case 'get':
                    this.parseGet(element);
                    break;
                case 'create':
                    this.parseCreate(element);
                    break;
                case 'append':
                    this.parseAppend(element);
                    break;
                case 'remove':
                    this.parseRemove(element);
                    break;
                case 'show':
                    this.parseShow(element);
                    break;
                case 'hide':
                    this.parseHide(element);
                    break;
                case 'toggle':
                    this.parseToggle(element);
                    break;
                case 'alert':
                    this.parseAlert(element);
                    break;
                case 'confirm':
                    this.parseConfirm(element);
                    break;
                case 'prompt':
                    this.parsePrompt(element);
                    break;
                case 'log':
                    this.parseLog(element);
                    break;
            }
        }

        parseFunction(element) {
            const name = element.getAttribute('name');
            if (!name) return;

            const functionBody = () => {
                Array.from(element.children).forEach(child => {
                    this.executeElement(child);
                });
            };

            this.functions[name] = functionBody;
            
            // 전역에서도 접근 가능하게
            window[name] = functionBody;
            
            element.style.display = 'none';
        }

        parseVariable(element) {
            const name = element.getAttribute('name');
            const value = element.getAttribute('value');
            const type = element.getAttribute('type') || 'string';
            
            let parsedValue;
            switch(type) {
                case 'number':
                    parsedValue = parseFloat(value);
                    break;
                case 'boolean':
                    parsedValue = value === 'true';
                    break;
                case 'array':
                    parsedValue = JSON.parse(value);
                    break;
                case 'object':
                    parsedValue = JSON.parse(value);
                    break;
                default:
                    parsedValue = value;
            }

            this.variables[name] = parsedValue;
            window[name] = parsedValue;
            
            element.style.display = 'none';
        }

        parseEventListener(element) {
            const target = element.getAttribute('target');
            const event = element.getAttribute('event');
            const functionName = element.getAttribute('function');

            let targetElement;
            if (target === 'window') {
                targetElement = window;
            } else if (target === 'document') {
                targetElement = document;
            } else {
                targetElement = document.getElementById(target) || document.querySelector(target);
            }

            if (targetElement && this.functions[functionName]) {
                targetElement.addEventListener(event, this.functions[functionName]);
            }

            element.style.display = 'none';
        }

        parseCall(element) {
            const functionName = element.getAttribute('function');
            const args = element.getAttribute('args');
            
            if (this.functions[functionName]) {
                if (args) {
                    const argArray = JSON.parse(`[${args}]`);
                    this.functions[functionName](...argArray);
                } else {
                    this.functions[functionName]();
                }
            }

            element.style.display = 'none';
        }

        parseIf(element) {
            const condition = element.getAttribute('condition');
            const evalCondition = this.evaluateCondition(condition);

            if (evalCondition) {
                Array.from(element.children).forEach(child => {
                    this.executeElement(child);
                });
            }

            element.style.display = 'none';
        }

        parseFor(element) {
            const init = element.getAttribute('init');
            const condition = element.getAttribute('condition');
            const increment = element.getAttribute('increment');

            // 간단한 for 루프 구현
            if (init) eval(init);
            
            while (this.evaluateCondition(condition)) {
                Array.from(element.children).forEach(child => {
                    this.executeElement(child);
                });
                if (increment) eval(increment);
            }

            element.style.display = 'none';
        }

        parseWhile(element) {
            const condition = element.getAttribute('condition');

            while (this.evaluateCondition(condition)) {
                Array.from(element.children).forEach(child => {
                    this.executeElement(child);
                });
            }

            element.style.display = 'none';
        }

        parseGetElementById(element) {
            const target = element.getAttribute('target');
            const targetElement = document.getElementById(target);
            
            if (targetElement) {
                Array.from(element.children).forEach(child => {
                    this.executeElementOnTarget(child, targetElement);
                });
            }

            element.style.display = 'none';
        }

        parseQuerySelector(element) {
            const selector = element.getAttribute('selector');
            const targetElement = document.querySelector(selector);
            
            if (targetElement) {
                Array.from(element.children).forEach(child => {
                    this.executeElementOnTarget(child, targetElement);
                });
            }

            element.style.display = 'none';
        }

        parseQuerySelectorAll(element) {
            const selector = element.getAttribute('selector');
            const targetElements = document.querySelectorAll(selector);
            
            targetElements.forEach(targetElement => {
                Array.from(element.children).forEach(child => {
                    this.executeElementOnTarget(child, targetElement);
                });
            });

            element.style.display = 'none';
        }

        parseSet(element) {
            const attributes = Array.from(element.attributes);
            const targetElement = this.getCurrentTarget(element);
            
            if (targetElement) {
                attributes.forEach(attr => {
                    const property = attr.name;
                    const value = attr.value;
                    
                    if (property.startsWith('data-')) {
                        targetElement.setAttribute(property, value);
                    } else if (property === 'innertext') {
                        targetElement.innerText = this.evaluateValue(value);
                    } else if (property === 'innerhtml') {
                        targetElement.innerHTML = this.evaluateValue(value);
                    } else if (property === 'value') {
                        targetElement.value = this.evaluateValue(value);
                    } else if (property.startsWith('style.')) {
                        const styleProp = property.substring(6);
                        targetElement.style[styleProp] = this.evaluateValue(value);
                    } else if (property !== 'class' && property !== 'id' && property !== 'style') {
                        targetElement[property] = this.evaluateValue(value);
                    }
                });
            }

            element.style.display = 'none';
        }

        parseGet(element) {
            const property = element.getAttribute('property');
            const variable = element.getAttribute('variable');
            const targetElement = this.getCurrentTarget(element);
            
            if (targetElement && property && variable) {
                this.variables[variable] = targetElement[property];
                window[variable] = targetElement[property];
            }

            element.style.display = 'none';
        }

        parseCreate(element) {
            const tag = element.getAttribute('tag');
            const variable = element.getAttribute('variable');
            
            if (tag) {
                const newElement = document.createElement(tag);
                
                if (variable) {
                    this.variables[variable] = newElement;
                    window[variable] = newElement;
                }

                Array.from(element.children).forEach(child => {
                    this.executeElementOnTarget(child, newElement);
                });
            }

            element.style.display = 'none';
        }

        parseAppend(element) {
            const targetSelector = element.getAttribute('target');
            const sourceSelector = element.getAttribute('source');
            
            const targetElement = targetSelector ? 
                (document.getElementById(targetSelector) || document.querySelector(targetSelector)) :
                this.getCurrentTarget(element);
                
            let sourceElement;
            if (sourceSelector) {
                // 변수로 저장된 요소인지 확인
                sourceElement = this.variables[sourceSelector] || window[sourceSelector] ||
                                document.getElementById(sourceSelector) || document.querySelector(sourceSelector);
            } else {
                sourceElement = this.getCurrentTarget(element);
            }
            
            if (targetElement && sourceElement) {
                targetElement.appendChild(sourceElement);
            }

            element.style.display = 'none';
        }

        parseRemove(element) {
            const targetElement = this.getCurrentTarget(element);
            if (targetElement && targetElement.parentNode) {
                targetElement.parentNode.removeChild(targetElement);
            }

            element.style.display = 'none';
        }

        parseShow(element) {
            const targetElement = this.getCurrentTarget(element);
            if (targetElement) {
                targetElement.style.display = '';
            }

            element.style.display = 'none';
        }

        parseHide(element) {
            const targetElement = this.getCurrentTarget(element);
            if (targetElement) {
                targetElement.style.display = 'none';
            }

            element.style.display = 'none';
        }

        parseToggle(element) {
            const targetElement = this.getCurrentTarget(element);
            if (targetElement) {
                targetElement.style.display = targetElement.style.display === 'none' ? '' : 'none';
            }

            element.style.display = 'none';
        }

        parseAlert(element) {
            const message = element.getAttribute('message') || element.textContent;
            alert(this.evaluateValue(message));
            element.style.display = 'none';
        }

        parseConfirm(element) {
            const message = element.getAttribute('message') || element.textContent;
            const variable = element.getAttribute('variable');
            const result = confirm(this.evaluateValue(message));
            
            if (variable) {
                this.variables[variable] = result;
                window[variable] = result;
            }

            element.style.display = 'none';
        }

        parsePrompt(element) {
            const message = element.getAttribute('message') || element.textContent;
            const variable = element.getAttribute('variable');
            const defaultValue = element.getAttribute('default') || '';
            const result = prompt(this.evaluateValue(message), this.evaluateValue(defaultValue));
            
            if (variable) {
                this.variables[variable] = result;
                window[variable] = result;
            }

            element.style.display = 'none';
        }

        parseLog(element) {
            const message = element.getAttribute('message') || element.textContent;
            console.log(this.evaluateValue(message));
            element.style.display = 'none';
        }

        executeElement(element) {
            this.parseElement(element);
        }

        executeElementOnTarget(element, target) {
            element._currentTarget = target;
            this.parseElement(element);
        }

        getCurrentTarget(element) {
            return element._currentTarget || 
                   (element.parentElement ? element.parentElement._currentTarget : null);
        }

        evaluateCondition(condition) {
            try {
                // 변수 치환
                let evaluatedCondition = condition;
                Object.keys(this.variables).forEach(varName => {
                    const regex = new RegExp(`\\b${varName}\\b`, 'g');
                    evaluatedCondition = evaluatedCondition.replace(regex, this.variables[varName]);
                });
                
                return eval(evaluatedCondition);
            } catch (e) {
                console.error('조건 평가 오류:', e);
                return false;
            }
        }

        evaluateValue(value) {
            if (typeof value !== 'string') return value;
            
            try {
                // 변수명인지 확인
                if (this.variables.hasOwnProperty(value)) {
                    return this.variables[value];
                }
                
                // 문자열 연결이나 계산식인지 확인
                if (value.includes('+') || value.includes('-') || value.includes('*') || value.includes('/')) {
                    let evaluatedValue = value;
                    Object.keys(this.variables).forEach(varName => {
                        const regex = new RegExp(`\\b${varName}\\b`, 'g');
                        evaluatedValue = evaluatedValue.replace(regex, this.variables[varName]);
                    });
                    return eval(evaluatedValue);
                }
                
                return value;
            } catch (e) {
                return value;
            }
        }
    }

    // 라이브러리 초기화
    window.HTMLJSLibrary = HTMLJSLibrary;
    new HTMLJSLibrary();

})();
