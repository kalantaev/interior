import React from 'react';
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import CheckIcon from '@material-ui/icons/Check';
import IconButton from '@material-ui/core/IconButton';
import CreateIcon from '@material-ui/icons/Create';
import agent from "../agent";
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';

class Contacts extends React.Component {


    state = { windowWidth: window.innerWidth};

    componentDidMount() {
        document.title = "Контакты MY DREAMS";
        this.getData();
        window.addEventListener('resize',
            () => this.setState({
                height: window.innerHeight,
                windowWidth: window.innerWidth
            }))
    }

    getData = () => {
        agent.Settings.getByKey("key=CITY&key=PHONE&key=EMAIL&key=CONTACT_LABEL")
            .then(rs => {
                let city = rs.find(i => i.key === "CITY");
                let phoneNumber = rs.find(i => i.key === "PHONE");
                let email = rs.find(i => i.key === "EMAIL");
                let label = rs.find(i => i.key === "CONTACT_LABEL");

                this.setState({
                    city: city && city.value || 'г. Симферополь',
                    phoneNumber: phoneNumber && phoneNumber.value || '+7 978 109-90-12',
                    label: label && label.value || 'Дизайн / Архитектура',
                    email: email && email.value || 'interiormydreams@gmail.com'
                });
            });

    };

    form = () => {


        // const [validated, setValidated] = useState(false);

        const handleSubmit = (event) => {
            const form = event.currentTarget;
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }

            // setValidated(true);
        };
        let elementById = document.getElementById('container');
        let innerWidth = elementById ? elementById.clientWidth : 750;
        let {windowWidth} = this.state;
        let width = innerWidth < 650 ? windowWidth < innerWidth ? windowWidth - 30 : innerWidth - 30 : innerWidth / 2.1
        let styleField = {width: width +'px', paddingBottom: "8px", paddingRight: "5px"};
        return <div >
            <div style={{display: "inline-block"}}>
            <TextField id="text"
                       style={styleField}
                       label="Имя"
                       variant="outlined"
                       onChange={(e) => this.setState({nameForm: e.target.value})}
                       type="text"/>
                       <br/>
            <TextField id="text"
                       onChange={(e) => this.setState({phoneForm: e.target.value})}
                       style={styleField} label="Телефон" variant="outlined" type="text"/><br/>
            <TextField required={true}
                       onChange={(e) => this.setState({emailForm: e.target.value})}
                       id="text" style={styleField} label="Email" variant="outlined" type="text"/>
            </div>
                <div style={{display: "inline-block"}}>
            <textarea style={{width: width +'px', height: "183px", marginBottom: "-38px", resize: "none"}}
                      onChange={(e) => this.setState({order: e.target.value})}
                      id="story" name="story" placeholder="Сообщение"
                      rows="5" cols="33"/>
                </div>
            <br/>
            {innerWidth < 650 && <br/>}
            {innerWidth < 650 && <br/>}
            <Button onClick={this.send} variant="dark">Отправить</Button>
        </div>;
    };

    send = () => {
        if (this.state.emailForm) {
            let data = {
                phone: this.state.phoneForm,
                email: this.state.emailForm,
                name: this.state.nameForm,
                orderText: this.state.order,
            }
            agent.Order.send(data)
                .then(rs => {
                    this.setState({
                        open: true,
                        message: "Сообщение отправлено"})
                }).catch(()=> {
                this.setState({open: true, message: "При отправке сообщения произошла ошибка, повторите попытку позже"})
            })
        } else {
            this.setState({open: true, message: "Необходимо указать email"})
        }

    }

    render() {
        const {city, phoneNumber, label, email, editCity, editLabel, editEmail, editPhone} = this.state;
        let isAdmin = agent.Auth.hasUser();
        return (
            <Container id={'container'}>
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
                <br/> <br/>
                {(!!city || isAdmin) && !editCity && <p className={'d-flex justify-content-center'}>{city}
                    {isAdmin &&
                    <IconButton style={{marginTop: "-10px"}} onClick={() => this.setState({editCity: true})}>
                        <CreateIcon color="primary" fontSize="small"/>
                    </IconButton>}</p>}
                {editCity && <p className={'d-flex justify-content-center'}>
                    <Form.Group as={Col} md="4" controlId="validationCustom01">
                        <Form.Control
                            type="text"
                            value={city}
                            onChange={(e) => {
                                this.setState({city: e.target.value});
                            }}
                            placeholder="Город"
                        />
                    </Form.Group>
                    <IconButton style={{marginTop: "-10px"}} onClick={() => {
                        this.setState({editCity: false});
                        agent.Settings.save({key: 'CITY', value: this.state.city})
                    }}>
                        <CheckIcon color="primary" fontSize="small"/>
                    </IconButton>

                </p>}
                {(!!label || isAdmin) && !editLabel && <p className={'d-flex justify-content-center'}><b>{label}</b>
                    {isAdmin &&
                    <IconButton style={{marginTop: "-10px"}} onClick={() => this.setState({editLabel: true})}>
                        <CreateIcon color="primary" fontSize="small"/>
                    </IconButton>}
                </p>}

                {editLabel && <p className={'d-flex justify-content-center'}>
                    <Form.Group as={Col} md="4" controlId="validationCustom01">
                        <Form.Control
                            type="text"
                            value={label}
                            onChange={(e) => {
                                this.setState({label: e.target.value});
                            }}
                        />
                    </Form.Group>
                    <IconButton style={{marginTop: "-10px"}} onClick={() => {
                        this.setState({editLabel: false});
                        agent.Settings.save({key: 'CONTACT_LABEL', value: this.state.label})
                    }}>
                        <CheckIcon color="primary" fontSize="small"/>
                    </IconButton>

                </p>}

                {(!!email || isAdmin) && !editEmail &&
                <div className={'d-flex justify-content-center'}><a href={'mailto:' + email}>{email}</a>
                    {isAdmin &&
                    <IconButton style={{marginTop: "-10px"}} onClick={() => this.setState({editEmail: true})}>
                        <CreateIcon color="primary" fontSize="small"/>
                    </IconButton>}
                </div>}

                {editEmail && <p className={'d-flex justify-content-center'}>
                    <Form.Group as={Col} md="4" controlId="validationCustom01">
                        <Form.Control
                            type="text"
                            value={email}
                            onChange={(e) => {
                                this.setState({email: e.target.value});
                            }}
                            placeholder="Email"
                        />
                    </Form.Group>
                    <IconButton style={{marginTop: "-10px"}} onClick={() => {
                        this.setState({editEmail: false});
                        agent.Settings.save({key: 'EMAIL', value: this.state.email})
                    }}>
                        <CheckIcon color="primary" fontSize="small"/>
                    </IconButton>

                </p>}

                {(!!phoneNumber || isAdmin) && !editPhone &&
                <div className={'d-flex justify-content-center'}><a href={'tel:' + phoneNumber}>{phoneNumber}</a>
                    {isAdmin &&
                    <IconButton style={{marginTop: "-10px"}} onClick={() => this.setState({editPhone: true})}>
                        <CreateIcon color="primary" fontSize="small"/>
                    </IconButton>}
                </div>}

                {editPhone && <p className={'d-flex justify-content-center'}>
                    <Form.Group as={Col} md="4" controlId="validationCustom01">
                        <Form.Control
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => {
                                this.setState({phoneNumber: e.target.value});
                            }}
                            placeholder="Город"
                        />
                    </Form.Group>
                    <IconButton style={{marginTop: "-10px"}} onClick={() => {
                        this.setState({editPhone: false});
                        agent.Settings.save({key: 'PHONE', value: this.state.phoneNumber})
                    }}>
                        <CheckIcon color="primary" fontSize="small"/>
                    </IconButton>

                </p>}

                <br/>
                {this.form()}
            </Container>
        );
    }
}

export default Contacts;
