import React from 'react';
import Image from 'react-bootstrap/Image'
import {Slide, Fade} from "react-slideshow-image";
import 'react-slideshow-image/dist/styles.css'
import Container from 'react-bootstrap/Container'
import agent from "../agent";
import {closeBtn, IMG_URL} from "../functions";
import Button from 'react-bootstrap/Button';

const properties = {
    transitionDuration: 500,
    autoplay: false
};

const style = (h, w) => {
    if(h < w) {
        return {
            textAlign: "center",
            background: "white",
            padding: "3px 0",
            height: h + 'px',
            width: 'auto',
            willChange: "transform"
        }
    } else {
        return {
            textAlign: "center",
            background: "white",
            padding: "3px 0",
            height: 'auto',
            width: w + 'px',
            willChange: "transform",
            margin: 'auto'
        }
    }
};

class Project extends React.Component {
    state = {
        modal: false,
        height: window.innerHeight,
        windowWidth: window.innerWidth
    };

    componentDidMount() {
        this.getProjectDataByGuid(this.props.match.params.guid);
        window.addEventListener('resize',
            () => this.setState({
                height: window.innerHeight,
                windowWidth: window.innerWidth
            }))
    }

    onEdit = () => {
        window.location.href = '/edit/' + this.props.match.params.guid;
    };

    render() {
        let isAdmin = agent.Auth.hasUser();
        let windowWidth = this.state.windowWidth * 0.93;
        let count = this.state.windowWidth > 800 ? 4 : this.state.windowWidth > 560 ? 2 : 1;
        let widthOneBlock = windowWidth / count;

        return <div style={{paddingLeft: count === 1 ? "0px" : "10px"}}>
            {isAdmin && <Button onClick={this.onEdit} variant="dark">Редактировать</Button>}
            {isAdmin && <Button variant="danger">Удалить</Button>}
            <div>
                {!this.state.modal && this.state.data && this.state.data.map((img, index) => {
                    let width = (img.gorizontal && count > 1 ? (widthOneBlock * 2 + 10) : widthOneBlock) + 'px';
                    let height = (img.gorizontal && count === 1 ? widthOneBlock / 2 : widthOneBlock) + 100 + 'px';
                    let style = {
                        marginLeft: '10px',
                        marginBottom: '10px',
                        width: width,
                        height: height,
                        float: "left"
                    };

                    return <div className={'box pointer'} style={style} onClick={
                        () => {
                            this.setState({modal: true, modalData: this.getModalData(img)})
                        }}>
                        <img src={IMG_URL + img.image} width={"100%"}/>
                    </div>
                })}
            </div>
            {this.renderModal()}
        </div>
    }

    renderModal = () => {
        let modalStyle = style(this.state.height, this.state.windowWidth);
        let data = this.state.data;
        let count = this.state.windowWidth > 800 ? 4 : this.state.windowWidth > 560 ? 2 : 1;
        if (count === 1) {
            return this.state.modal && this.state.modalData && <div className={'my-modal'}>
                <Slide {...properties}>
                    {this.state.modalData.map((i, index) =>{
                        let st = this.state.height < this.state.windowWidth ? 'box2' : 'box3';
                        return <table><tr><td style={{verticalAlign: 'middle', height: this.state.height + 'px', width: this.state.windowWidth + 'px'}}>
                            <div key={'div' + index} style={modalStyle} className={st}>
                            <Image src={IMG_URL + i} />
                        </div></td></tr></table>})}
                </Slide>
                {closeBtn(() => this.setState({modal: false}), "close-elem-ico")}
            </div>
        } else {
            return this.state.modal && this.state.modalData && <div className={'my-modal'}>
                <Fade {...properties}>
                    {this.state.modalData.map((i, index) =>{
                        let st = this.state.height < this.state.windowWidth ? 'box2' : 'box3';
                        return <div key={'div' + index} style={modalStyle} className={st}>
                            <Image src={IMG_URL + i} />
                        </div>})}
                </Fade>
                {closeBtn(() => this.setState({modal: false}), "close-elem-ico")}
            </div>
        }
    };

    getProjectDataByGuid = (guid) => {
        agent.Project.byGuid(guid)
            .then(projectDataByGuid => {
                this.setState({data: projectDataByGuid.images});
                document.title = "Проект \"" +  projectDataByGuid.title + "\" студия дизайна MY DREAMS"
            });
    };

    getModalData = (img) => {
        let images = this.state.data.map(i => i.image);
        let index = images.indexOf(img.image);
        let result = images.splice(0, index);
        result.forEach(i => images.push(i));
        return images;
    }
}

export default Project;
