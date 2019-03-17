import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Service from './Service.js';
import Cliente from './Cliente';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { usuario: '', senha: '', usuarioAutenticado: null };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    render() {
        return (
            <div className="App-header">
                <h3>Prova
                <button hidden={!this.state.usuarioAutenticado} onClick={this.handleClick}>
                    Logout
                </button>
                </h3>
                <br/>
                <br/>
                <form hidden={this.state.usuarioAutenticado} onSubmit={this.handleSubmit}>
                    <input
                        id="usuario"
                        name="usuario"
                        placeholder="Usuário"
                        onChange={this.handleChange}
                    />
                    <br/><br/>
                    <input
                        id="senha"
                        name="senha"
                        placeholder="Senha"
                        type="password"
                        onChange={this.handleChange}
                    />
                    <br/><br/>
                    <button className="btn btn-primary">
                        Login
                    </button>
                </form>
                <Cliente usuario={this.state.usuarioAutenticado}/>
            </div>
        );
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit(e) {
        e.preventDefault();
        if (!this.state.usuario.length || !this.state.senha.length) {
            alert('Prencha usuãrio e senha.')
            return;
        }
        Service.autenticar(this.state.usuario, this.state.senha)
            .then((res) => this.setState({ usuarioAutenticado: res.data}));
    }

    handleClick() {
        this.setState({ usuarioAutenticado: null});
    }
}

export default App;