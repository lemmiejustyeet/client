import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import "./AddSong.css";
import { ISong } from "./comm";

export default class AddSong extends React.Component<{ song: ISong, onApply: (song: ISong) => void, hide: () => void}, ISong> {

    constructor(props: any, context: any) {
        super(props, context);

        this.state = {
            _id: this.props.song._id,
            _rev: this.props.song._rev,
            date: this.props.song.date,
            image_url: this.props.song.image_url,
            // UNLINK ARRAY
            othersongs: this.props.song.othersongs && this.props.song.othersongs.slice(),
            ratings: this.props.song.ratings,
            title: this.props.song.title,
            url: this.props.song.url
        };
    }

    public render() {
        return (
            <div className="addsong">
                <div className="title">
                    <span>Title</span>
                    <input defaultValue={this.state.title} onChange={this.titlechange} />
                </div>
                <div className="url">
                    <span>URL</span>
                    <input defaultValue={this.state.url} onChange={this.urlchange} />
                </div>
                <div className="imageurl">
                    <span>Image Url</span>
                    <input defaultValue={this.state.image_url} onChange={this.imageurlchange} />
                </div>
                <div className="othersongs">
                    <span>Mashed songs</span>
                    <div className="songs">
                        {
                            this.state.othersongs && this.state.othersongs.map((x, i) => <input className="song" key={i} defaultValue={x} onChange={this.othersongschange}/>)
                        }
                    </div>
                    <div className="add" onClick={this.addsong}><FontAwesomeIcon icon={faPlus}/></div>
                    <div className={`remove ${this.state.othersongs && this.state.othersongs.length > 0 ? "enable" : "disable"}`} onClick={this.state.othersongs && this.state.othersongs.length > 0 ? this.removesong : undefined}><FontAwesomeIcon icon={faTimes}/></div>
                </div>
                <hr/>
                <div className="ok" onClick={this.applychanges}>Apply</div>
                <div className="close" onClick={this.props.hide}>Cancel</div>
            </div>
        );
    }

    private titlechange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            title: e.currentTarget.value
        });
    }
    private urlchange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            url: e.currentTarget.value
        });
    }
    private imageurlchange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            image_url: e.currentTarget.value
        });
    }
    private othersongschange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            othersongs: Array.from(e.currentTarget.parentElement && e.currentTarget.parentElement.children || []).map((x: HTMLInputElement) => x.value)
        });
    }
    private addsong = (e: React.MouseEvent<HTMLDivElement>) => {
        if (this.state.othersongs) {
            this.state.othersongs.push("");
            this.forceUpdate();
        } else {
            this.setState({
                othersongs: [""]
            });
        }
    }
    private removesong = (e: React.MouseEvent<HTMLDivElement>) => {
        if (this.state.othersongs) {
            this.state.othersongs.pop();
            this.forceUpdate();
        }
    }

    private applychanges = () => {
        const song: ISong = {
            _id: this.state._id,
            _rev: this.state._rev,
            date: this.state.date || Date.now(),
            image_url: this.state.image_url,
            othersongs: this.state.othersongs,
            ratings: this.state.ratings,
            title: this.state.title,
            url: this.state.url
        };

        this.props.onApply(song);
    }
}