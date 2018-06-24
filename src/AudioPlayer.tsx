import { faPause, faPlay, faVolumeOff, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import "./AudioPlayer.css";

export default class AudioPlayer extends React.Component<{ src: string }, { time: number, playing: boolean, muted: boolean }> {
    private audio: HTMLAudioElement;
    private isMouseDown: boolean = false;
    private bar: React.RefObject<HTMLDivElement>;
    private waspaused: boolean;

    constructor(p: any, c: any) {
        super(p, c);

        this.state = {
            muted: false,
            playing: false,
            time: 0,
        };

        this.audio = new Audio(this.props.src);
        this.audio.ontimeupdate = this.ontimeupdate;

        document.addEventListener("mouseup", this.mouseup);
        document.addEventListener("mousemove", this.mousemove);

        this.bar = React.createRef();
    }

    public render() {
        const totalTime = this.audio.duration;
        const currentTime = this.state.time;

        return (
            <div className="audio">
                <div className="elements">
                    <div className="playbutton" onClick={this.togglePlay}>
                        {
                            this.audio.paused
                                ? <FontAwesomeIcon icon={faPlay} />
                                : <FontAwesomeIcon icon={faPause} />
                        }
                    </div>
                    <div className="bar" onClick={this.reactmouseclick} onMouseMove={this.reactmousemove} onMouseDown={this.mousedown} ref={this.bar}>
                        <div className="progress" style={{ width: `${(currentTime / totalTime) * 100}%` }} />
                        <div className="button" style={{ left: `${(currentTime / totalTime) * 100}%` }} />
                    </div>
                    <div className="time">
                        <div className="currenttime">{this.formatTime(currentTime)}</div> / <div className="totaltime">{this.formatTime(totalTime)}</div>
                    </div>
                    <div className="volume" onClick={this.toggleMute}>
                        {
                            this.state.muted
                                ? <FontAwesomeIcon icon={faVolumeOff} />
                                : <FontAwesomeIcon icon={faVolumeUp} />
                        }
                    </div>
                </div>
            </div>
        );
    }

    private formatTime(time: number) {
        time = Math.round(time);

        const seconds = time % 60;
        let secondszero: string = "";
        if (seconds < 10) {
            secondszero = "0";
        }

        const minutes = Math.floor(time / 60);
        let minuteszero: string = "";
        if (minutes < 10) {
            minuteszero = "0";
        }

        return `${minuteszero}${minutes}:${secondszero}${seconds}`;
    }

    private toggleMute = () => {
        if (this.state.muted) {
            this.setState({
                muted: false
            });
            this.audio.muted = false;
        } else {
            this.setState({
                muted: true
            });
            this.audio.muted = true;
        }
    }

    private togglePlay = () => {
        if (this.state.playing) {
            this.pause();
        } else {
            this.play();
        }
    }

    private play() {
        this.audio.play();
        this.setState({
            playing: true
        });
    }

    private pause() {
        this.audio.pause();
        this.setState({
            playing: false
        });
    }

    private ontimeupdate = () => {
        this.setState({
            time: this.audio.currentTime
        });
        if (this.audio.paused) {
            this.setState({
                playing: false
            });
        }
    }

    private mousedown = () => {
        this.isMouseDown = true;
        this.waspaused = this.audio.paused;
        this.pause();
    }

    private mouseup = () => {
        if (this.isMouseDown && !this.waspaused) {
            this.play();
        }
        this.isMouseDown = false;
    }

    private mousemove = (e: MouseEvent) => {
        if (!this.isMouseDown) {
            return;
        }
        this.changebarstate(e.pageX);
    }

    private reactmouseclick = (e: React.MouseEvent<HTMLDivElement>) => {
        this.changebarstate(e.pageX);
    }

    private reactmousemove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!this.isMouseDown) {
            return;
        }
        this.changebarstate(e.pageX);
    }

    private changebarstate = (xpos: number) => {
        const rect = this.bar.current && this.bar.current.getBoundingClientRect();

        if (!rect) {
            return;
        }

        let newDurationPercent = ((xpos - rect.left) / rect.width);

        if (newDurationPercent > 1) {
            newDurationPercent = 1;
        } else if (newDurationPercent < 0) {
            newDurationPercent = 0;
        }

        this.audio.currentTime = newDurationPercent * this.audio.duration;
    }
}