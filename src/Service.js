import axios from 'axios';
const URL_RESOURCE = 'http://localhost:3004/api';

export default class Service {

    static autenticar(name, password) {
        const user = {name: name, password: password};
        return axios.post(`${URL_RESOURCE}/authenticate`, user);
    }

    static recuperarClientes() {
        return axios.get(`${URL_RESOURCE}/clients`);
    }

    static consultaCep(cep) {
        return axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    }

    static cadastrarCliente(cliente) {
        return axios.post(`${URL_RESOURCE}/clients`, cliente);
    }
}
