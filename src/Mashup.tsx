import * as React from "react";
import * as Modal from "react-modal";
import { deleteSong, ISong, IUser, voteSong } from "./comm";
import "./Mashup.css";
import MashupController from "./MashupController";

import { faDownload, faEdit, faThumbsDown, faThumbsUp, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon }  from "@fortawesome/react-fontawesome";

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
                <div className="info">
                    <div className="title">{song.title}</div>
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
                    <div className="othersongs">({song.othersongs && song.othersongs.join(", ")})</div>
                    <audio controls={true} className="audio">
                        <source src={song.url}/>
                    </audio>
                    <div className={`ratings ${this.props.currentuser ? "enabled" : "disabled"}`}>
                        <div className={`up ${this.uservote === "up" ? "select" : ""}`} onClick={this.voteup}><FontAwesomeIcon icon={faThumbsUp}/>{song.ratings && song.ratings.up.length}</div>
                        <div className={`down ${this.uservote === "down" ? "select" : ""}`} onClick={this.votedown}><FontAwesomeIcon icon={faThumbsDown}/>{song.ratings && song.ratings.down.length}</div>
                    </div>
                    <a href={song.url} className="download" target="_blank"><FontAwesomeIcon icon={faDownload}/></a>
                    {
                        this.props.currentuser && this.props.currentuser.elevated 
                        ? <div className="elevated">
                            <div onClick={this.promptremove} className="delete"><FontAwesomeIcon icon={faTrashAlt}/></div>
                            <div className="edit"><FontAwesomeIcon icon={faEdit}/></div>
                        </div>
                        : ""
                    }
                </div>
                <div className="trap"/>
                <img className="background" src={song.image_url} />
                <Modal isOpen={this.state.modalIsOpen} style={{content: {
                    height: "100px",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "300px"
                }, overlay: {"z-index": "10000000000"}}}>
                    <div className="confirm">
                        <div className="head">Are you sure?</div>
                        <div className="yes" onClick={this.remove}>YES</div>
                        <div className="no" onClick={this.hidemodal}>NO</div>
                    </div>
                </Modal>
            </div>
        );
    }

    private promptremove = (e: React.MouseEvent<HTMLDivElement>) => {
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

    private voteup = async () => {
        if (this.props.currentuser && this.uservote !== "up") {
            await voteSong(this.props.song._id, "up");
            await this.props.controller.refresh();
        }
    }

    private votedown = async () => {
        if (this.props.currentuser && this.uservote !== "down") {
            await voteSong(this.props.song._id, "down");
            await this.props.controller.refresh();
        }
    }

    get uservote() {
        if (this.props.currentuser) {
            if (this.props.song.ratings.down.indexOf(this.props.currentuser.id) !== -1) {
                return "down";
            }
            if (this.props.song.ratings.up.indexOf(this.props.currentuser.id) !== -1) {
                return "up";
            }
        }
        return null;
    }
}