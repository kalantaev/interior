import React from 'react';
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from '@material-ui/core/Button';
import agent from "../agent";
import Image from 'react-bootstrap/Image'
import Row from 'react-bootstrap/Row';
import {closeBtn, IMG_URL} from "../functions";
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import CheckIcon from '@material-ui/icons/Check';


function validated() {

}

let gorizontMap = new Map();

class AddNew extends React.Component {
    state = {images: [], orderNumber: 0};

    componentDidMount() {
        let isEdit = !!this.props.match.params.guid;
        this.setState({isEdit: isEdit});
        if (isEdit) {
            this.getProjectDataByGuid(this.props.match.params.guid);
        }

    }

    getProjectDataByGuid = (guid) => {
        agent.Project.byGuid(guid)
            .then(projectDataByGuid => {
                let main = projectDataByGuid.images.filter(i => i.main).map(i => i.image);
                if (main.length > 0) {
                    main = main[0]
                } else if (projectDataByGuid.images.length > 0) {
                    main = projectDataByGuid.images[0].image
                } else {
                    main = undefined;
                }
                this.setState({...projectDataByGuid, images: projectDataByGuid.images.map(i => i.image), mainImg: main});
            });
    };

    form = () => {
        const handleSubmit = (event) => {
            const form = event.currentTarget;
            if (form.checkValidity() === true) {
                let mainImg = this.state.mainImg;
                let project = {
                    id: this.state.id,
                    title: this.state.title,
                    orderNumber: this.state.orderNumber,
                    images: this.state.images.map((img, index) => {
                        return {image: img,
                            main: img === mainImg,
                            gorizontal: gorizontMap.get(img)}
                    })
                };

                let promis = this.state.isEdit ? agent.Project.update : agent.Project.save;
                promis(project)
                    .then((rs => {
                        window.location.href = '/project/' + rs.replace(/"/g, "");
                    }));
            }
            event.preventDefault();
            event.stopPropagation();

        };
        let elementById = document.getElementById('container');

        let innerWidth = elementById ? elementById.clientWidth : 750;


        let windowWidth = innerWidth * 0.94;
        let count = innerWidth > 740 ? 4 : innerWidth > 560 ? 2 : 1;
        let widthOneBlock = windowWidth / count;
        return (
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Row>
                    <Form.Group as={Col} md="8" controlId="validationCustom01">
                        <Form.Control
                            required
                            type="text"
                            value={this.state.title}
                            onChange={(e) => {
                                this.setState({title: e.target.value})
                            }}
                            placeholder="Наименование"
                        />
                        <Form.Control.Feedback type="invalid">
                            Необходимо ввести наименование
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form.Row>
                <Form.Group>
                    <input type="file" name="images" id="imgid"  onChange={this.saveFile} multiple/>
                    {/*<Form.File id="exampleFormControlFile1" onChange={(e) => this.saveFile(e)}/>*/}
                </Form.Group>
                <Form.Row>
                    {this.state.images && this.state.images.map((img, index) => {
                        let gorizontal = gorizontMap.get(img);
                        let width = (gorizontal && count > 1 ? (widthOneBlock * 2 + 10) : widthOneBlock) + 'px';
                        let height = (gorizontal && count === 1 ? widthOneBlock / 2 : widthOneBlock) + 100 + 'px';
                        let style = {
                            marginLeft: '10px',
                            marginBottom: '10px',
                            width: width,
                            height: height,
                            float: "left"
                        };

                        return <div className={'box pointer visible-block'} style={style}>
                            <img src={IMG_URL + img}
                                 className={'visible-block'}
                                 draggable="true"
                                 onDragStart={() => this.onDragStart(img)}
                                 onDragEnd={() => this.onDragEnd(img)}
                                 onDragOver={() => this.onDragOver(img)}
                                 width={"100%"}
                                 ref={(el) => {
                                     let value = gorizontMap.get(img);
                                     if (value === undefined && el) {
                                         gorizontMap.set(img, el.naturalWidth > el.naturalHeight);
                                         this.setState({})
                                     }
                                 }}/>

                            <div className={"invisible-block"} style={{
                                background: "rgb(183, 181, 181, 0.51)",
                                position: "relative",
                                width: "100%"
                            }}>
                                <div style={{display: "inline-block"}}><IconButton aria-label="delete" onClick={() => this.deleteFile(img)}>
                                    <DeleteForeverIcon color="secondary" fontSize="large"/>
                                </IconButton>
                                </div>
                                {this.state.mainImg !== img &&
                                <div style={{display: "inline-block"}} onClick={()=>this.setState({mainImg: img})}><b>Установить главной</b></div>}
                            </div>

                            {this.state.mainImg === img && <IconButton aria-label="delete" style={{float: 'right', marginTop: '-60px', background: "rgba(231,255,246,0.81)"}} >
                                   Главная <CheckIcon color="primary" fontSize="large"/>
                                </IconButton>}
                        </div>
                    })}
                </Form.Row>
                <div>
                    <Button variant="contained" color="primary" type="submit">
                        Сохранить
                    </Button>
                </div>
            </Form>
        );
    };

    onDragStart = (event) => {
        this.setState({dragableImage: event})
    };

    onDragEnd = () => {
        let {images, dragableImage, currentImageToChange} = this.state;
        let number = images.indexOf(dragableImage);
        let number1 = images.indexOf(currentImageToChange);
        let correct = number > number1 ? 0 : 1;
        let newImages = [];
        images.forEach((i, index) => {
            if (index !== number) {
                if (index === number1 + correct) {
                    newImages.push(dragableImage)
                }
                newImages.push(i)
            }
        });
        if (number1 === images.length - 1) {
            newImages.push(dragableImage)
        }
        this.setState({images: newImages})
    };
    onDragOver = (event) => {
        this.setState({currentImageToChange: event})

    };

    deleteFile = (guid) => {
        let img = this.state.images;
        agent.Image.delete(guid)
            .then((rs) => {
                img.splice(img.indexOf(guid), 1);
                this.setState({images: img})
            })
    };

    saveFile = (data) => {
        if (data.target.files.length > 0) {
            for (let i = 0; i < data.target.files.length; i++) {
                let file = data.target.files[i];
                if (file) {
                    let formData = new FormData();
                    formData.append('content', file);
                    agent.Image.save(formData)
                        .then((rs) => {
                            let img = this.state.images;
                            img.unshift(rs.replace(/"/g, ""));
                            this.setState({images: img})
                        })
                }
            }
        }
    };

    render() {
        return (
            <Container id={'container'}>
                {this.form()}
            </Container>
        );
    }
}

export default AddNew;
