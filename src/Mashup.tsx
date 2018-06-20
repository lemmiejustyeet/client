import * as React from "react";
import * as Modal from "react-modal";
import { deleteSong, ISong, IUser, updateSong, voteSong } from "./comm";
import "./Mashup.css";
import MashupController from "./MashupController";

import { faDownload, faEdit, faThumbsDown, faThumbsUp, faTimes, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon }  from "@fortawesome/react-fontawesome";

import * as ReactTooltip from "react-tooltip";
import AddSong from "./AddSong";

Modal.setAppElement("#root");

export default class Mashup extends React.Component<{ song: ISong, controller: MashupController, currentuser?: IUser }, { deleteModalOpen: boolean, editModalOpen: boolean}> {

    constructor(props: any, context: any) {
        super(props, context);

        this.state = {
            deleteModalOpen: false,
            editModalOpen: false
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
                    <div className="othersongs">{song.othersongs ? `(${song.othersongs && song.othersongs.join(", ")})` : "Unknown other songs"}</div>
                    <audio controls={true} className="audio">
                        <source src={song.url}/>
                    </audio>
                    <div className={`ratings ${this.props.currentuser ? "enabled" : "disabled"}`} data-tip={this.props.currentuser ? null : "Login to vote"}>
                        <div className={`up ${this.uservote === "up" ? "select" : ""}`} onClick={this.voteup}><FontAwesomeIcon icon={faThumbsUp}/>{song.ratings && song.ratings.up.length}</div>
                        <div className={`down ${this.uservote === "down" ? "select" : ""}`} onClick={this.votedown}><FontAwesomeIcon icon={faThumbsDown}/>{song.ratings && song.ratings.down.length}</div>
                    </div>
                    <div className="floatright">
                        <a href={song.url} className="download" target="_blank"><FontAwesomeIcon icon={faDownload}/></a>
                        {
                            this.props.currentuser && this.props.currentuser.elevated 
                            ? <div className="elevated">
                                <div onClick={this.promptremove} className="delete"><FontAwesomeIcon icon={faTrashAlt}/></div>
                                <div onClick={this.editsong} className="edit"><FontAwesomeIcon icon={faEdit}/></div>
                            </div>
                            : ""
                        }
                    </div>
                </div>
                <div className="trap"/>
                {
                    song.image_url ? <img className="background" src={song.image_url} /> : null
                }
                <Modal isOpen={this.state.deleteModalOpen} style={{content: {
                    height: "82px",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "200px",
                }, overlay: {zIndex: "10000000000", background: "#000000AA"}}}>
                    <div className="confirm">
                        <div className="head">Are you sure?</div>
                        <div className="yes" onClick={this.remove}>Delete <FontAwesomeIcon icon={faTrashAlt}/></div>
                        <div className="no" onClick={this.hidedeletemodal}>Cancel <FontAwesomeIcon icon={faTimes}/></div>
                    </div>
                </Modal>
                <Modal isOpen={this.state.editModalOpen} style={{content: {
                    height: "400px",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    width:  window.innerWidth > 640 ? "600px" : `${window.innerWidth - 100}px`,
                }, overlay: {zIndex: "10000000000", background: "#000000AA"}}}>
                    <AddSong song={this.props.song} hide={this.hideeditmodal} onApply={this.applychanges}/>
                </Modal>
                <ReactTooltip effect="solid" place="right" type="info"/>
            </div>
        );
    }

    private promptremove = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        this.setState({
            deleteModalOpen: true
        });
    }

    private hidedeletemodal = () => {
        this.setState({
            deleteModalOpen: false
        });
    }

    private editsong = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        this.setState({
            editModalOpen: true
        });
    }

    private hideeditmodal = () => {
        this.setState({
            editModalOpen: false
        });
    }

    private applychanges = async (song: ISong) => {
        await updateSong(song, song._id);
        await this.props.controller.refresh();
        this.hideeditmodal();
    }

    private remove = async () => {
        this.setState({
            deleteModalOpen: false
        });

        await deleteSong(this.props.song._id);

        await this.props.controller.refresh();
    }

    private voteup = async () => {
        if (this.props.currentuser) {
            if (this.props.song.ratings.up.indexOf(this.props.currentuser.id) !== -1) {
                this.props.song.ratings.up.splice(this.props.song.ratings.up.indexOf(this.props.currentuser.id), 1);
            } else {
                this.props.song.ratings.up.push(this.props.currentuser.id);
            }
            if (this.props.song.ratings.down.indexOf(this.props.currentuser.id) !== -1) {
                this.props.song.ratings.down.splice(this.props.song.ratings.down.indexOf(this.props.currentuser.id), 1);
            }

            this.forceUpdate();

            await voteSong(this.props.song._id, "up");
            await this.props.controller.refresh();
        }
    }

    private votedown = async () => {
        if (this.props.currentuser) {
            if (this.props.song.ratings.down.indexOf(this.props.currentuser.id) !== -1) {
                this.props.song.ratings.down.splice(this.props.song.ratings.down.indexOf(this.props.currentuser.id), 1);
            } else {
                this.props.song.ratings.down.push(this.props.currentuser.id);
            }
            if (this.props.song.ratings.up.indexOf(this.props.currentuser.id) !== -1) {
                this.props.song.ratings.up.splice(this.props.song.ratings.up.indexOf(this.props.currentuser.id), 1);
            }

            this.forceUpdate();

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