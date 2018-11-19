import React, {Component} from 'react';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import InputCustomizado from './componentes/InputCustomizado';
import SelectCustomizado from './componentes/SelectCustomizado';
import ButtonCustomizado from './componentes/ButtonCustomizado';
import TratadorErros from './TratadorErros'

class TabelaLivros extends Component{
    
    render(){
        return(
            <div>            
                <table className="pure-table">
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Preço</th>
                      <th>Autor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.props.livros.map(function(livro){
                        return (
                          <tr key={livro.id}>
                            <td>{ livro.titulo }</td>
                            <td>{ livro.preco }</td>
                            <td>{ livro.autor.nome }</td>
                          </tr>
                        );
                      })
                    }
                  </tbody>
                </table> 
            </div>
        );
    }
}

class FormularioLivro extends Component{

    constructor(){
        super();
        this.state = {titulo: '', preco: 0.0, autor: '', autores: []}
        this.enviaForm = this.enviaForm.bind(this);
        this.setTitulo = this.setTitulo.bind(this);
        this.setPreco = this.setPreco.bind(this);
        this.setAutor = this.setAutor.bind(this);
    }

    componentDidMount(){
        $.ajax({
            url: "http://cdc-react.herokuapp.com/api/autores",
            dataType: "json",
            success: function(resposta){
              this.setState({autores: resposta});
            }.bind(this)
        });
    }

    enviaForm(evento){
        evento.preventDefault();
        $.ajax({
          url: 'http://cdc-react.herokuapp.com/api/livros',
          contentType: 'application/json',
          dataType: 'json',
          type: 'post',
          data: JSON.stringify({titulo: this.state.titulo, preco: this.state.preco, autorId: this.state.autor}),
          success: function(novaListagem){
            PubSub.publish('atualiza-lista-livros', novaListagem);
            this.setState({titulo: '', preco: null, autor: ''});
          }.bind(this),
          error: function(resposta){
            if(resposta.status === 400){
              new TratadorErros().publicaErros(resposta.responseJSON);
            }
          },
          beforeSend: function(){
            PubSub.publish("limpa-erros", {});
          }
        })
    }

    setTitulo(evento){
        this.setState({titulo: evento.target.value});
    }
    setPreco(evento){
        this.setState({preco: evento.target.value});
    }
    setAutor(evento){
        this.setState({autor: evento.target.value});
    }

    render(){
        return(
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
                    <InputCustomizado id="titulo" type="text" name="titulo" value={this.state.titulo} onChange={this.setTitulo} label="Titulo" />
                    <InputCustomizado id="preco" type="number" name="preco" value={this.state.precoo} onChange={this.setPreco} label="Preço" />
                    <SelectCustomizado id="autorId" name="autorId" onChange={this.setAutor} value={this.state.autor} autores={this.state.autores} label="Autor"/>
                    <ButtonCustomizado type="submit" button="Gravar" />
                </form>
            </div>
        );
    }
}

export default class LivrosBox extends Component{
    constructor(){
        super();
        this.state = {livros: []};
    }

    componentDidMount(){
        $.ajax({
            url: "http://cdc-react.herokuapp.com/api/livros",
            dataType: "json",
            success: function(resposta){
              this.setState({livros: resposta});
            }.bind(this)
        });
        PubSub.subscribe('atualiza-lista-livros', function(topico, novaLista){
            this.setState({livros: novaLista});
        }.bind(this));
    }

    render(){
        return(

            <div>
                <div className="header">
                    <h1>Lista de Livros</h1>
                </div>
                <div className="content" id="content">
                    <FormularioLivro callbackAtualizaListagem={this.atualizaListagem}/>
                    <TabelaLivros livros={this.state.livros}/>
                </div>
            </div>
        );
    }
}