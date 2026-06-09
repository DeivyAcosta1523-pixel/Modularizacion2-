const inputTareaDesc = document.getElementById('userMessage');

export function clearTaskInput() {
    if (inputTareaDesc) {
        inputTareaDesc.value = '';
    }
}