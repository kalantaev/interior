import React, {useState, useRef} from 'react';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import {Editor} from "react-draft-wysiwyg";
import {EditorState, convertToRaw, ContentState } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import agent from "../agent";
import Button from 'react-bootstrap/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import CheckIcon from '@material-ui/icons/Check';
import CreateIcon from '@material-ui/icons/Create';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

class Prices extends React.Component {
    state = {windowWidth: window.innerWidth};

    componentDidMount() {
        document.title = "Услуги и цены MY DREAMS";
        this.getData();
        this.state = {
            editorState: EditorState.createEmpty(),
        };
        window.addEventListener('resize',
            () => this.setState({
                height: window.innerHeight,
                windowWidth: window.innerWidth
            }))
    }

    getData = () => {
        agent.Price.getAll()
            .then(rs => {
                this.setState({data: rs})
            });
    };

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState
        });
    };

    saveNew = () => {
        let {editorState, data} = this.state;
        if (editorState) {
            agent.Price.save({
                id: this.state.editId,
                label: 'ПРОЕКТ',
                name: this.state.name,
                price: this.state.price,
                description: draftToHtml(convertToRaw(editorState.getCurrentContent()))
            })
                .then(rs => {
                    this.setState({editorState: EditorState.createEmpty(), addNew: false, editId: undefined, name: undefined, price: undefined});
                    this.getData()
                })
        }
    };

    delete = (i, index) => {
        let {data} = this.state;
        agent.Price.delete(i.id)
            .then(() => {
                data.splice(index, 1);
                this.setState({data})
            })
    };

    onEdit = (i) => {
        const contentBlock = htmlToDraft(i.description);
        let editorState = EditorState.createEmpty();
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            editorState = EditorState.createWithContent(contentState);
        }
        this.setState({editId: i.id, addNew: true, name: i.name, price: i.price, editorState: editorState})
    };

    render() {
        let isAdmin = agent.Auth.hasUser();
        let {editorState, addNew} = this.state;
        let windowWidth = this.state.windowWidth * 0.93;
        let count = this.state.windowWidth > 800 ? 3 : this.state.windowWidth > 560 ? 2 : 1;
        let widthOneBlock = windowWidth / count;
        return (
            <div>
                <div className={'padding'}/>
                {isAdmin && <Button onClick={() => this.setState({addNew: true})} variant="dark">Добавить</Button>}
                <CardDeck>
                    {this.state.data && this.state.data.map((i, index) => {
                        let width = (widthOneBlock) + 'px';
                        let height = (widthOneBlock) + 100 + 'px';
                        let style = {
                            marginLeft: '10px',
                            marginBottom: '10px',
                            width: width,
                            float: "left"
                        };

                        return <div style={style} className={"prices"}>
                            <div style={{
                                background: 'rgb(247, 247, 247)',
                                width: width,
                                height: '250px',
                                textAlign: 'center',
                                letterSpacing: "0em",
                                lineHeight: "1.2",
                                fontFamily: 'Arial',
                                fontSize: "13px"
                            }}>
                                <div style={{letterSpacing: "0.3em",fontSize: "11px", padding: "20px 0 50px 0"}}>{'ПРОЕКТ'}</div>
                                <div style={{letterSpacing: "0em",fontSize: "36px", padding: "20px 0 50px 0"}}>{i.name}</div>
                                <div style={{fontSize: "13px", fontWeight: "bold", color: "rgba(0,0,0,.99)"}} dangerouslySetInnerHTML={{__html: i.price}}/>
                            </div>
                            <Card.Body>
                                <Card.Text>
                                    Состав проекта:<br/>
                                    <div dangerouslySetInnerHTML={{__html: i.description}}/>
                                </Card.Text>
                            </Card.Body>
                            {isAdmin && <div>
                                <IconButton onClick={() => this.onEdit(i, index)}>
                                    <CreateIcon color="primary" fontSize="small"/>
                                </IconButton>
                                <IconButton aria-label="delete" onClick={() => this.delete(i, index)}>
                                    <DeleteForeverIcon color="secondary" fontSize="large"/>
                                </IconButton>
                            </div>}
                        </div>
                    })}
                </CardDeck>
                {isAdmin && addNew && <div style={{
                    width: "33%",
                    height: "150px"
                }}>
                    <Form.Row>
                        <Form.Group as={Col} md="6" controlId="validationCustom01">
                            <Form.Control
                                type="text"
                                placeholder="Наименование"
                                value={this.state.name}
                                onChange={(e)=>{this.setState({name: e.target.value})}}
                                required
                            />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} md="6" controlId="validationCustom04">
                            <Form.Control
                                type="text"
                                placeholder="Цена"
                                value={this.state.price}
                                onChange={(e)=>{this.setState({price: e.target.value})}}
                                required
                            />
                        </Form.Group>
                    </Form.Row>
                    Состав проекта:
                </div>}
                {isAdmin && addNew && <div style={{
                    width: "33%",
                    height: "300px",
                    border: '1px solid rgba(0,0,0,.125)',
                    borderRadius: ".25rem"
                }}>

                    <Editor
                        editorState={editorState}
                        wrapperClassName="demo-wrapper"
                        editorClassName="demo-editor"
                        onEditorStateChange={this.onEditorStateChange}
                    />
                </div>}
                {isAdmin && addNew &&  <Button onClick={this.saveNew} variant="dark">Сохранить</Button>}
            </div>
        );
    }
}

export default Prices;
