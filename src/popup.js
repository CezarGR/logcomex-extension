const redirectButton = document.getElementById('redirect-button-id')
const canceltButton = document.getElementById('cancel-button-id')
const environmentSelect = document.getElementById('environment-id')
const addressInput = document.getElementById('address-id')
const checkbox = document.getElementById('checkbox-id')
const checkboxLabel = document.getElementById('checkbox-label-id')

const environments = [
    {
        name: 'Homologação',
        address: 'http://hml-logmanager.logcomex.io'
    },
    {
        name: 'Desenvolvimento',
        address: 'http://localhost:3000'
    }
]

// const [tab] = await chrome.tabs.query({
//     active: true,
//     currentWindow: true
// })

// if (ta no dominio .logcomex.io)
const mainContent = document.querySelector('.mainContainer')
// mainContent.classList.add('hide-element')


const noContent = document.querySelector('#no-content')
noContent.classList.remove('hide-element')


setUpEnviromentSelectAndAddressInput()

checkboxLabel.addEventListener('click', () => {
    checkbox.checked = !checkbox.checked
})

environmentSelect.addEventListener('click', () => {
    const environment = environmentSelect.selectedOptions[0].innerText

    const environmentSelected = environments.filter((item) => {
        return item.name === environment
    })[0];

    addressInput.value = environmentSelected.address

    if (environmentSelected.name === 'Desenvolvimento') {
        addressInput.disabled = false
        addressInput.classList.remove('mainContainer__body__form__input--disabled')
        return;
    }

    addressInput.disabled = true
    addressInput.classList.add('mainContainer__body__form__input--disabled')
});

redirectButton.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    })

    chrome.scripting.executeScript({
        target: { tabId: tab.id},
        args: [addressInput.value, checkbox.checked],
        function: redirect
    })
})

canceltButton.addEventListener('click', async () => {
    window.close();
})

const redirect = (address, openInNewTab) => {
    const params = new URLSearchParams({
        token: localStorage.token,
        email: localStorage.email
    });
    
    window.open(
        `${address}/?${params}`,
        openInNewTab ? '_blank' : '_self'
    ).focus()
}

function setUpEnviromentSelectAndAddressInput() {
    environments.forEach(environment => {
        let newOption = new Option(environment.name, environment.address);
        environmentSelect.add(newOption, undefined)
    })

    addressInput.value = environmentSelect.selectedOptions[0].value
}
