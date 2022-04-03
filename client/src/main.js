import '../style.css';
import { io } from 'socket.io-client';
import { term } from './term';
import { AttachAddon } from './attach';

const hostId = window.location.pathname.split('/')[1];
const socket = io({ path: `/${hostId}/socket.io` });
const attach = new AttachAddon(socket);

term.loadAddon(attach);