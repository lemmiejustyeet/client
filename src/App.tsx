import * as React from "react";
import "./App.css";
import { getDiscordUser, IUser } from "./comm";
import MashupController from "./MashupController";

interface IAppState {
    currentuser?: IUser;
    isTop: boolean;
}

export default class App extends React.Component<{}, IAppState> {

    constructor(props: any, context: any) {
        super(props, context);

        this.state = {
            isTop: true
        };

        (async () => {
            this.setState({
                currentuser: await getDiscordUser()
            });
        })();
    }

    public componentDidMount() {
        document.addEventListener("scroll", () => {
            const isTop = window.scrollY < 50;
            if (isTop !== this.state.isTop) {
                this.setState({ isTop, currentuser: this.state.currentuser });
            }
        });
      }

    public render() {
        return (
            <div className="app">
                <div className="header">
                    <div className="title">Matt's Mashups</div>
                    <div className={`bar ${this.state.isTop ? "top" : "notop"}`}>
                        <div className="left">
                            <a className="link">Matt's Mashups</a>
                        </div>
                        <div className="right">
                            {
                                this.state.currentuser
                                    ? <span className="logout">
                                        <a onClick={this.preventDefault}>
                                            <img src={`https://cdn.discordapp.com/avatars/${this.state.currentuser && this.state.currentuser.id}/${this.state.currentuser && this.state.currentuser.avatar}.png`} />
                                            <span className="username">{this.state.currentuser && this.state.currentuser.username}</span><span className="descriminator">#{this.state.currentuser && this.state.currentuser.discriminator}</span>
                                        </a>
                                        <a className="logoutbutton" onClick={this.logout}>
                                            Sign out
                                        </a>
                                    </span>
                                    : <a className="login link" href="https://dusterthefirst.ddns.net:38564/auth/discord/">
                                        Login
                                    </a>
                            }
                        </div>
                    </div>
                </div>
                <MashupController currentuser={this.state.currentuser}/>
            </div>
        );
    }

    public logout = (event: React.MouseEvent<HTMLAnchorElement>) => {
        window.location.href = `https://dusterthefirst.ddns.net:38564/auth/discord/token/revoke?code=${window.localStorage.getItem("discordauthkey")}`;
        this.forceUpdate();
    }

    public preventDefault = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
    }
}