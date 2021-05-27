import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';

import {Route, Switch} from 'react-router-dom';
import Portfolio from "./Portfolio";
import Prices from "./Prices";
import Contacts from "./Contacts";
import Project from "./Project";
import Login from "./Login";
import AddNew from "./AddNew";
import agent from "../agent";
import DehazeIcon from '@material-ui/icons/Dehaze';
import {Slide} from "react-slideshow-image";
import {closeBtn, IMG_URL} from "../functions";
import ChangeOrder from "./ChangeOrder";


class App extends React.Component {

    state = {windowWidth: window.innerWidth};

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
        window.addEventListener('resize',
            () => this.setState({
                height: window.innerHeight,
                windowWidth: window.innerWidth
            }))
    }

    handleScroll = () => {
        if (window.pageYOffset > 100) {
            this.setState({
                showFixedMenu: true,
            });
        } else {
            this.setState({
                showFixedMenu: false,
            });
        }
    };

    renderMenu = (isAdmin, main) => {
        let showMenu = this.state.windowWidth > 570;

        if (showMenu) {
            return <div className={"d-flex justify-content-center menu"}>
                <a href="/" className={this.getStyleNavLink("/")}>ПОРТФОЛИО</a>
                <a href="/prices" className={this.getStyleNavLink("/prices")}>УСЛУГИ И ЦЕНЫ</a>
                <a href="/contacts" className={this.getStyleNavLink("/contacts")}>КОНТАКТЫ</a>
                {isAdmin &&
                <a href="/addNew" className={this.getStyleNavLink("/addNew")}>Добавтить новую публикацию</a>}
                {isAdmin && <a href="/" onClick={() => agent.Auth.logout()} className="nav-link">Выйти</a>}
            </div>
        } else if (main) {
            return <div className={'menu'}
                        onClick={this.showMenu}
                        style={{
                float: "right",
                marginTop: "-66px"
            }}><DehazeIcon className={'pointer'} /></div>
        }
    };

    showMenu = () => {
        this.setState({showMenu: true})
    };

    getStyleNavLink = (link) => {
        if (window.location.href.substr(window.location.href.lastIndexOf("/")) === link) {
            return 'nav-link active'
        } else {
            return 'nav-link'
        }
    };

    renderModal = (isAdmin) => {
        return this.state.showMenu && <div className={'my-modal'}>
            <div className={"menu"} style={{paddingTop: "50px", paddingLeft: "10px"}}>
                <b><a href="/" className={this.getStyleNavLink("/")}>ПОРТФОЛИО</a></b>
                <b><a href="/prices" className={this.getStyleNavLink("/prices")}>УСЛУГИ И ЦЕНЫ</a></b>
                    <b><a href="/contacts" className={this.getStyleNavLink("/contacts")}>КОНТАКТЫ</a></b>
                {isAdmin &&
                <b><a href="/addNew" className={this.getStyleNavLink("/addNew")}>Добавтить новую публикацию</a></b>}
                {isAdmin && <b><a href="/" onClick={() => agent.Auth.logout()} className="nav-link">Выйти</a></b>}
            </div>
            {closeBtn(() => this.setState({showMenu: false}), "close-elem-ico")}
        </div>
    }

    render() {
        let isAdmin = agent.Auth.hasUser();
        return (
            <div>
                {this.state.showFixedMenu &&
                <div className={"transform-show2"}>
                    <div className={"fixed-top"}>
                        {this.renderMenu(isAdmin)}
                    </div>
                </div>}
                <div className="d-flex justify-content-center">
                    <h1 style={{borderBottom: '5px solid black', borderTop: '5px solid black', marginTop: '5px'}}>
                        MY DREAMS</h1>
                </div>
                <div className={'d-flex justify-content-center hint'}>Студия дизайна</div>
                {this.renderMenu(isAdmin, true)}
                {this.renderModal(isAdmin)}
                <Switch>
                    <Route exact path="/" component={Portfolio}/>
                    <Route exact path="/prices" component={Prices}/>
                    <Route exact path="/contacts" component={Contacts}/>
                    <Route exact path="/project/:guid" component={Project}/>
                    <Route exact path="/edit/:guid" component={AddNew}/>
                    <Route exact path="/login" component={Login}/>
                    <Route exact path="/addNew" component={AddNew}/>
                    <Route exact path="/ordering" component={ChangeOrder}/>
                </Switch>

            </div>
        );
    }
}


export default App;
