import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import * as Modal from "react-modal";
import AddSong from "./AddSong";
import "./App.css";
import { addSong, getDiscordUser, ISong, IUser } from "./comm";
import MashupController from "./MashupController";

interface IAppState {
    currentuser?: IUser;
    isTop: boolean;
    addModalOpen: boolean;
}

export default class App extends React.Component<{}, IAppState> {

    private controller = React.createRef<MashupController>();

    constructor(props: any, context: any) {
        super(props, context);

        this.state = {
            addModalOpen: false,
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
                    <div className="title">Drawbits' Drive-Thru</div>
                    <div className={`bar ${this.state.isTop ? "top" : "notop"}`}>
                        <div className="left">
                            <a className="link">Drawbits' Drive-Thru</a>
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
                {
                    this.state.currentuser && this.state.currentuser.elevated
                        ? <div className="addsong" onClick={this.showAddModal}>Add Song <FontAwesomeIcon icon={faPlus}/></div>
                        : null
                }
                <MashupController currentuser={this.state.currentuser} ref={this.controller}/>
                <footer>
                    Mashups created by Matthew Gray <span className="tag">@Drawbits#0260</span><br/>
                    Header art from Stardust Speedway Act 2, Sonic Mania
                </footer>
                <Modal isOpen={this.state.addModalOpen} style={{content: {
                    height: "400px",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "600px",
                }, overlay: {zIndex: "10000000000", background: "#000000AA"}}}>
                    <AddSong song={{} as any} hide={this.hideAddModal} onApply={this.addSongToServer}/>
                </Modal>
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

    private hideAddModal = () => {
        this.setState({
            addModalOpen: false
        });
    }

    private showAddModal = () => {
        this.setState({
            addModalOpen: true
        });
    }

    private addSongToServer = async (song: ISong) => {
        await addSong(song);
        if (this.controller.current) {
            this.controller.current.refresh();
        }
        this.hideAddModal();
    }
}