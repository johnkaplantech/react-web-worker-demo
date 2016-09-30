﻿import React from 'react';//import 'babel-polyfill';var Worker = require('worker!./Worker.js');export default class WorkerClient extends React.Component {    constructor(props) {        super(props);        this.state = {            'index': 0,            'result': 0,            'worker': new Worker()        };    }    componentDidMount() {        this.state.worker.addEventListener('message', (event) => {            console.log('returned from worker');            var buffer = event.data.buffer;            var view = new global.Uint32Array(buffer);            this.setState({'index': view[0], 'result': view[1]});        });        this.updateCanvas();     }    invokeWorker() {        var buffer = new global.ArrayBuffer(2 * 4);        var view = new global.Uint32Array(buffer);        view[0] = this.state.index;        view[1] = this.state.result;        this.state.worker.postMessage({'buffer': buffer}, [buffer]);   }    updateCanvas() {        const ctx = this.refs.canvas.getContext('2d');        ctx.fillStyle = 'hsl(' + ((this.state.index * 10) % 360).toString() + ', 80%, 95%)';        ctx.fillRect(0, 0, 300, 500);        ctx.font = '24px sans-serif';        ctx.fillStyle = 'black';        ctx.fillText(this.state.result.toString(), 10, 50);    }    componentDidUpdate() {        this.updateCanvas();    }    render() {        return (            <canvas ref="canvas" width={300} height={100} onClick={(event) => {this.invokeWorker()}} />        );    }}