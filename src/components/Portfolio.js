
import React from 'react';
import agent from "../agent";
import {IMG_URL} from "../functions";
import Button from 'react-bootstrap/Button';


class Portfolio extends React.Component {
    state = {windowWidth: window.innerWidth};

    componentDidMount() {
        document.title = "Студия дизайна MY DREAMS";
        this.getData();
        window.addEventListener('resize',
            () => this.setState({
                windowWidth: window.innerWidth
            }))
    }

    getData = () => {
        agent.Project.getAll().then(data => {
            this.setState({data: data})
        })
    };

    onChangeOrder = () => {
        window.location.href = '/ordering'
    }

    renderItems = () => {
        let windowWidth = this.state.windowWidth * 0.98;
        let count = this.state.windowWidth > 740 ? 3 : this.state.windowWidth > 560 ? 2 : 1;
        let widthOneBlock = windowWidth / count;
        let isAdmin = agent.Auth.hasUser();
        return (
            <div>
                {isAdmin && <Button onClick={this.onChangeOrder} variant="dark">Изменить порядок</Button>}
                <div>
                {this.state.data && this.state.data.map((item, index) => {
                    let main = item.images.filter(i => i.main).map(i => i.image);
                    if (main.length > 0) {
                        main = main[0]
                    } else if (item.images.length > 0)  {
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
                        <a href={`/project/${item.url}`}>
                            <img src={IMG_URL + main} height={"100%"} alt={item.title}/>
                            <br/>

                        </a>
                    </div>
                        <div style={{textAlign: "center"}}>
                        <a style={styleLink} className={"menu"}  href={`/project/${item.url}`}>{item.title}</a>
                    </div>
                    </div>
                })}
                </div>
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

export default Portfolio;
