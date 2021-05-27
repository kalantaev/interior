import React from 'react';
import agent from "../agent";
import {IMG_URL} from "../functions";
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';


class ChangeOrder extends React.Component {
    state = {windowWidth: window.innerWidth};

    componentDidMount() {
        this.getData();
        window.addEventListener('resize',
            () => this.setState({
                windowWidth: window.innerWidth
            }))
    }

    getData = () => {
        agent.Project.getAll().then(data => {
            this.setState({data: data, order: data.map(i=> i.id)})
        })
    };

    onDragStart = (event, index) => {
        this.setState({dragableImage: index})
    };

    onDragEnd = () => {
        let {data, dragableImage, currentImageToChange} = this.state;
        let number = data[dragableImage];
        let number1 = data[currentImageToChange];
        let correct = dragableImage > currentImageToChange ? 0 : 1;
        let newImages = [];
        data.forEach((i, index) => {
            if (index !== dragableImage) {
                if (index === currentImageToChange + correct) {
                    newImages.push(number)
                }
                newImages.push(i)
            }
        });
        if (currentImageToChange === data.length - 1) {
            newImages.push(number)
        }
        this.setState({data: newImages})
    };
    onDragOver = (event, index) => {
        this.setState({currentImageToChange: index})

    };

    onChangeOrder = () => {
        agent.Project.changeOrder({indexInputs: this.state.data.map(i=>({id: i.id}))})
            .then(()=> {
                this.setState({open: true, message: 'Индексы успешно обновлены'})
            }).catch(e => {
            this.setState({open: true, message: 'Во время обновления произошла ошибка'})
        })
    };

    renderItems = () => {
        let elementById = document.getElementById('container');

        let innerWidth = elementById ? elementById.clientWidth : 750;


        let windowWidth = innerWidth * 0.94;
        let count = 4;
        let widthOneBlock = windowWidth / count;
        let isAdmin = agent.Auth.hasUser();
        return (
            <div className={'ordering'}>
                {isAdmin && <Button onClick={this.onChangeOrder} variant="dark">Сохранить</Button>}
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.open}
                    autoHideDuration={2000}
                    onClose={()=>{this.setState({open: false})}}
                    message={this.state.message}
                    action={
                        <React.Fragment>
                            <IconButton size="small" aria-label="close" color="inherit" onClick={()=>{this.setState({open: false})}}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </React.Fragment>
                    }
                />
                <Container>
                    {this.state.data && this.state.data.map((item, index) => {
                        let main = item.images.filter(i => i.main).map(i => i.image);
                        if (main.length > 0) {
                            main = main[0]
                        } else if (item.images.length > 0) {
                            main = item.images[0].image
                        } else {
                            main = undefined
                        }
                        let width = widthOneBlock + 'px';
                        let height = widthOneBlock + 'px';
                        let styleBox = {
                            marginLeft: '5px',
                            marginBottom: '5px',
                            width: width,
                            height: widthOneBlock + 33 + 'px',
                            float: "left"
                        };

                        let styleLink = {marginTop: "-5px", letterSpacing: ".1em", fontSize: "13px"};

                        let styleImg = {...styleBox, height: widthOneBlock + 'px'};

                        return <div style={styleBox}>
                            <div className={'box pointer'} style={styleImg}>

                                <img src={IMG_URL + main}
                                     height={"100%"}
                                     draggable="true"
                                     onDragStart={() => this.onDragStart(item.id, index)}
                                     onDragEnd={() => this.onDragEnd(item.id, index)}
                                     onDragOver={() => this.onDragOver(item.id, index)}
                                     alt={item.title}/>
                                <br/>


                            </div>
                            <div style={{textAlign: "center"}}>
                                <a style={styleLink} className={"menu"}>{item.title}</a>
                            </div>
                        </div>
                    })}
                </Container>
            </div>
        );
    };

    render() {

        return (
            <div>
                {this.renderItems()}
            </div>
        );
    }
}

export default ChangeOrder;
