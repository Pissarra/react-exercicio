import React, { Component } from 'react';
import Service from './Service';
import InputMask from 'react-input-mask';
import StringMask from 'string-mask';

const formatarTelefone = function(tipo, numero) {
    var mask = new StringMask(tipo === 'CELULAR' ? '(00)00000-0000' : '(00)0000-0000');
    return mask.apply(numero);
}
const UFs = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

class Cliente extends Component {

    constructor(props) {
        super(props);
        this.state = { clients: [], phones: [], client: {name: '', cpf: '', cep: '', logradouro: '', bairro: '', uf: '', complemento: ''}};
        this.phone = {typePhone: 'CELULAR'};
        this.handleChangeCliente = this.handleChangeCliente.bind(this);
        this.handleChangeCep = this.handleChangeCep.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangePhone = this.handleChangePhone.bind(this);
        this.handleAddPhone = this.handleAddPhone.bind(this);
    }

    componentWillReceiveProps (nextProps){
        if (!nextProps.usuario){
            return;
        }
        Service.recuperarClientes().then((clients) => this.setState({clients: clients.data}));
        console.log(" buscou");
    }

    render() {
        return (
            <div  hidden={!this.props.usuario}>
                <form ref={(el) => this.formRef = el}
                        hidden={!this.props.usuario || this.props.usuario.authority === 'COMUM'}
                        onSubmit={this.handleSubmit}>
                    <h4>Cadastrar Cliente</h4>
                    <br/>
                    <label htmlFor="nome">Nome: </label>
                    <input id="name"
                           name="name"
                           required
                           minLength="3"
                           maxLength="100"
                           onChange={this.handleChangeCliente}/>
                    <br/>
                    <label htmlFor="cpf">CPF: </label>
                    <InputMask id="cpf"
                           name="cpf"
                           placeholder="000.000.000-00"
                           required
                           mask="999.999.999-99"
                           minLength="13"
                           value={this.state.client.cpf}
                           ref={(el) => this.cpfRef = el}
                           onChange={this.handleChangeCliente}/>
                    <br/>
                    <label htmlFor="cep">CEP: </label>
                    <InputMask id="cep"
                           name="cep"
                           minLength="8"
                           mask="99999-999"
                           placeholder="00000-000"
                           required
                           type="text"
                           value={this.state.client.cep}
                           ref={(el) => this.cepRef = el}
                           onChange={this.handleChangeCep}/>
                    <br/>
                    <label htmlFor="logradouro">Logradouro: </label>
                    <input id="logradouro"
                           required
                           name="logradouro"
                           onChange={this.handleChangeCliente}
                            value={this.state.client.logradouro}/>
                    <br/>
                    <label htmlFor="bairro">Bairro: </label>
                    <input id="bairro"
                           required
                           name="bairro"
                           onChange={this.handleChangeCliente}
                           value={this.state.client.bairro}/>
                    <br/>
                    <label htmlFor="uf">UF: </label>
                    <select id="uf"
                           name="uf"
                           required
                           onChange={this.handleChangeCliente} value={this.state.client.uf}>
                            {UFs.map( u => {return <option key={u} value={u}>{u}</option>})}
                    </select>
                    <br/>
                    <label htmlFor="complemento">Complemento: </label>
                    <input id="complemento"
                           name="complemento"
                           onChange={this.handleChangeCliente}
                           value={this.state.client.complemento}/>
                    <br/>
                    <label htmlFor="typePhone">Tipo telefone: </label>
                    <input type="radio"
                           name="typePhone"
                           onChange={this.handleChangePhone}
                           value="CELULAR"
                           checked={this.phone.typePhone === 'CELULAR'}/> Celular
                    <input type="radio"
                           name="typePhone"
                           onChange={this.handleChangePhone}
                           value="RESIDENCIAL"
                           checked={this.phone.typePhone === 'RESIDENCIAL'}/> Residencial
                    <input type="radio"
                           name="typePhone"
                          value="COMERCIAL"
                           onChange={this.handleChangePhone}
                           checked={this.phone.typePhone === 'COMERCIAL'}/> Comercial
                    <br/>
                    <label htmlFor="numero">Telefone: </label>
                    <InputMask name="numero"
                            ref={(el) => this.phoneNumeroRef = el}
                            value={this.phone.numero}
                            mask={this.state.typePhone === 'CELULAR' ? '(99)99999-9999' : '(99)9999-9999'}
                            placeholder={this.state.typePhone === 'CELULAR' ? '(00)00000-0000': '(00)0000-0000'}
                            onChange={this.handleChangePhone}/>
                    <br/>

                    <i className="btn btn-secondary" onClick={this.handleAddPhone}>
                         Adicionar Telefone
                        </i>
                    <br/>
                    <ul>
                        {this.state.phones.map(p => {
                            return <li key={p.numero}>{formatarTelefone(p.typePhone, p.numero)}</li>
                        })}
                    </ul>
                    <br/>
                    <button className="btn btn-primary">
                        Cadastrar
                    </button>
                </form>
                <br/>
                <br/>
                <Lista items={this.state.clients}/>
            </div>
        );
    }

    handleChangeCliente(e) {
        const client = this.state.client;
        client[e.target.name] = e.target.value.replace(/[^a-z0-9 ]/gi, "");
        this.setState({client: client});
    }

    handleChangePhone(e) {
        this.phone[e.target.name] = e.target.value.replace(/[^a-z0-9 ]/gi, "");
        if (e.target.name === 'typePhone') {
            this.setState({typePhone: this.phone.typePhone});
        }
    }

    handleChangeCep(e) {
        this.handleChangeCliente(e);
        if (this.state.client.cep && this.state.client.cep.length === 8) {
            Service.consultaCep(this.state.client.cep).then((endereco) => {
                const client = this.state.client;
                client.logradouro = endereco.data.logradouro;
                client.bairro = endereco.data.bairro;
                client.uf = endereco.data.uf;
                client.complemento = endereco.data.complemento;
                this.setState({client: client});
            })
        }
    }

    handleAddPhone(e) {
        const tamanhoMinimoTelefone = (this.phone.typePhone && this.phone.typePhone === ' CELULAR') ? 11 : 10;
        if (!this.phone.typePhone || !this.phone.numero || this.phone.numero.length < tamanhoMinimoTelefone) {
            return;
        }
        const phones = this.state.phones;
        phones.push(Object.assign({}, this.phone));
        this.setState({phones: phones});
        this.phoneNumeroRef.value = '';
        this.phone = {};
    }

    handleSubmit(e) {
        e.preventDefault();
        if ( !this.state.phones.length ) {
            alert('Adicione ao menos um telefone.');
            return;
        }
        const client = this.state.client;
        client.phones = this.state.phones;
        Service.cadastrarCliente(client)
            .then(() => {
                Service.recuperarClientes().then((clients) => this.setState({clients: clients.data}));
                this.resetForm();
            });
    }

    resetForm() {
        this.setState({client: {}, phones: [], typePhone: 'CELULAR'});
        this.formRef.reset();
        this.cpfRef.value = '';
        this.cepRef.value = '';
        this.phoneNumeroRef.value = '';
    }
}

export default Cliente;

class Lista extends Component {

    render() {
        return (
            <table className="table-bordered">
                <thead>
                    <tr>
                        <td>Nome</td>
                        <td>CPF</td>
                        <td>CEP</td>
                        <td>Endereço</td>
                        <td>Telefone</td>
                    </tr>
                </thead>
                <tbody>
                {this.props.items.map(client => (
                    <tr key={client.id}>
                        <td>{client.name}</td>
                        <td>{this.formatarCpf(client.cpf)}</td>
                        <td>{this.formatarCep(client.cep)}</td>
                        <td>
                            {client.logradouro}, {client.bairro} - {client.uf}<br/>
                            <small>{client.complemento}</small>
                        </td>
                        <td>
                            <ul>
                                {client.phones.map((phone) => {
                                   return <li key={phone.id}>{formatarTelefone(phone.typePhone, phone.numero)}</li>
                                })}
                            </ul>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        );
    }

    formatarCpf(vl) {
        var mask = new StringMask('000.000.000-00');
        return mask.apply(vl);
    }

    formatarCep(vl) {
        var mask = new StringMask('00000-000');
        return mask.apply(vl);
    }
}