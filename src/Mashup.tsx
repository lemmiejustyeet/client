import * as React from "react";
import * as Modal from "react-modal";
import "./App.css";
import { deleteSong, ISong, IUser } from "./comm";
import MashupController from "./MashupController";

Modal.setAppElement("#root");

export default class Mashup extends React.Component<{ song: ISong, controller: MashupController, currentuser?: IUser }, { modalIsOpen: boolean }> {

    constructor(props: any, context: any) {
        super(props, context);

        this.state = {
            modalIsOpen: false
        };
    }

    public render() {
        const song = this.props.song;

        return (
            <div className="mashup">
                <hr />
                <img className="background" src={song.image_url} />
                <a className="title" href={song.url}>{song.title}</a>
                <div className="date">{
                    new Date(song.date).toLocaleString("en-US", {
                        day: "numeric",
                        hour: "numeric",
                        hour12: true,
                        minute: "numeric",
                        month: "long",
                        second: "numeric",
                        weekday: "long",
                        year: "numeric"
                    })
                }</div>
                <div className="othersongs">{song.othersongs}</div>
                <div className="ratings">
                    <div className="up">{song.ratings && song.ratings.up}</div>
                    <div className="down">{song.ratings && song.ratings.down}</div>
                </div>
                {
                    this.props.currentuser && this.props.currentuser.elevated ? <div className="elevated">
                        <a onClick={this.promptremove} href="">DELETE</a>
                        <a>edit</a>
                    </div> : ""
                }
                <Modal isOpen={this.state.modalIsOpen} style={{content: {
                    height: "300px",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "300px"
                }}}>
                    Are you sure?
                    <div className="yes" onClick={this.remove}>YES</div>
                    <div className="no" onClick={this.hidemodal}>NO</div>
                </Modal>
            </div>
        );
    }

    private promptremove = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        this.setState({
            modalIsOpen: true
        });
    }

    private hidemodal = () => {
        this.setState({
            modalIsOpen: false
        });
    }

    private remove = async () => {

        await deleteSong(this.props.song._id);

        await this.props.controller.refresh();
    }
}