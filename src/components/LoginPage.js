import React, { useEffect, useState, useContext } from "react";
import { Form, Button, InputGroup, FormControl, Alert } from "react-bootstrap";
import "../scss/loginPage.scss";
import { appRoutes } from "../constants/routes";
import AppContext, { appContextActions } from "../context/AppContext";
import { Route, Switch, Link } from "react-router-dom";
import debugService from "../services/debug.service";

function getResetPasswordRoute(path) {

    return `${path === "/" ? path : (path + "/")}reset-password`
}

export default function LoginPage({ match }) {


    return <div>
        <div className="login_page">
            <div className="login_form">
                <div className="border_light">
                    <h5 className="mb-0">Hermes</h5>
                    <img src={`${""}/img/checkout_logo.svg`} alt="checkout" className="mb-3" />
                    <Switch>
                        <Route path={getResetPasswordRoute(match.path)} component={ResetPassword} />
                        <Route component={LoginForm} />
                    </Switch>
                </div>
            </div>
        </div>
    </div>;
}


function ResetPassword() {

    function resetPassword(e) {

        e.preventDefault();
        const { target } = e;
        debugService.debug(target);
    }

    return <Form onSubmit={resetPassword}>
        <Form.Label >Locked yourself out?</Form.Label>
        <p className="help-block">Don't worry, we will send you help. Just enter your email below to receive password reset instructions</p>
        <Form.Group>
            <Form.Label >Password</Form.Label>
            <InputGroup>
                <InputGroup.Prepend>
                    <InputGroup.Text>@</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                    type="email"
                    name="email"
                    required={true} />
            </InputGroup>
        </Form.Group>
        <Button
            variant="primary"
            type="submit"
            className="margin_top_10">
            Reset Password
        </Button>
    </Form >
}

function LoginForm({ match }) {

    const [state, setstate] = useState({
        authenticated: false,
        hasError: false,
        loginAttempts: 4 // actually it is 3 attempts, we subtract 1 from the default value each time we fail auth
    });

    const [appContext, dispatch] = useContext(AppContext);

    useEffect(
        () => { dispatch({ type: appContextActions.hideSpinner }); }, 
        // eslint-disable-next-line
        []
    )

    async function tryAuth(email, password) {

        try {

            dispatch({ type: appContextActions.showSpinner });

            const response = await appContext.auth._oktaAuth.signIn({
                username: email,
                password: password
            });

            // the route to redirect after ImplicitCallback parse token
            localStorage.setItem("secureRouterReferrerPath", JSON.stringify(appRoutes.queryEditor));
            const { sessionToken } = response;
            appContext.auth.redirect({ sessionToken });

        } catch (e) {

            setstate(state => ({
                ...state,
                hasError: true,
                loginAttempts: state.loginAttempts - 1
            }));
            dispatch({ type: appContextActions.hideSpinner });
        }
    }

    function onSubmit(e) {

        e.preventDefault();
        const inputs = e.target.elements;
        const { email, password } = inputs;

        tryAuth(email.value, password.value);
    }

    return <Form onSubmit={onSubmit}>
        <Form.Group>
            <Form.Label>Email</Form.Label>
            <InputGroup>
                <InputGroup.Prepend>
                    <InputGroup.Text>@</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                    disabled={!state.loginAttempts}
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    isInvalid={state.hasError}
                    required={true} />
            </InputGroup>
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlInput1">
            <Form.Label >Password</Form.Label>
            <InputGroup>
                <InputGroup.Prepend>
                    <InputGroup.Text className="oi" data-glyph="lock-locked" />
                </InputGroup.Prepend>
                <Form.Control
                    disabled={!state.loginAttempts}
                    type="password"
                    name="password"
                    isInvalid={state.hasError}
                    required={true} />
                <InputGroup.Append>
                    <InputGroup.Text><Link to={getResetPasswordRoute(match.path)}>Forgot?</Link></InputGroup.Text>
                </InputGroup.Append>
            </InputGroup>
        </Form.Group>
        {state.hasError &&
            <Alert variant="danger">
                <Alert.Heading>Login failed</Alert.Heading>
                <div>Invalid email or password</div>
                <div>Login attempts left: {state.loginAttempts}</div>
            </Alert>
        }
        <Button
            disabled={!state.loginAttempts}
            variant="primary"
            type="submit"
            className="margin_top_10">
            Submit
        </Button>
    </Form>
}