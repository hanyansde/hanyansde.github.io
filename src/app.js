import {Image} from './components/image';

export class App {
	constructor() {
		this.imgArray = [];
		//this.imgIndex = 0;
		this.numPerPage = 1;
		this.curOffset = 0;
		this.imgWidth = 220;
		this.ttlOffset = 1;
		this.album = '8PH6b';// 8PH6b has 11 images, bKbM4 has 400+
	}

	created() {
		this.fetchData();
		this.resetNumPerPage();
	}

	resetNumPerPage() {
		var viewWidth = window.innerWidth;
		if (viewWidth > 1600) {
			this.numPerPage = 4;
		} else if (viewWidth > 1200) {
			this.numPerPage = 3;
		} else if (viewWidth > 800) {
			this.numPerPage = 2;
		} else {
			this.numPerPage = 1;
		}
	}

	toggleAlbum() {
		this.album = this.album === '8PH6b' ? 'bKbM4' : '8PH6b';
		this.resetVariables();
		this.fetchData();
	}

	resetVariables() {
		this.imgArray = [];
		this.curOffset = 0;
		this.ttlOffset = 1;
		document.querySelector('.imgContainer').style.transform = `translate(0px)`;
	}

	fetchData() {
		var album_id = this.album;
		var api_key = '5a92b132cddbf5c';
		var request_url = 'https://api.imgur.com/3/album/' + album_id;
		var req = new XMLHttpRequest();
		var self = this;

		req.onreadystatechange = function() { 
			if (req.readyState === 4 && req.status == 200) {
				if (req && req.length === 0) {
					console.log('Imgur album is empty.');
				} else {
					var json = JSON.parse(req.response);
					if (json && json.data && json.data.images) {
						self.generateImgArray(json.data.images);
						var width = 320 * json.data.images.length + 'px';
						document.querySelector('.imgContainer').style.width = width;
					}
				}
			} else {
				//console.log('error');
			}
		}
		req.open('GET', request_url, true); // true for asynchronous     
		req.setRequestHeader('Authorization', 'Client-ID ' + api_key);
		req.send(null);
	}

	generateImgArray(arr) {
		for (var i = 0; i < arr.length; i++) {
			this.imgArray.push(new Image(arr[i].link, arr[i].id));
		}
	}

	onClickArrow(direction) {
		this.resetNumPerPage();

		var length = this.imgArray.length;
		var numOfPages = Math.ceil(length / this.numPerPage);
		var nextOffset = this.curOffset + direction * this.imgWidth * this.numPerPage * -1;
		this.ttlOffset = this.imgWidth * length;
		if (direction === -1 && this.curOffset === 0) {
			nextOffset = this.ttlOffset * -1 + this.imgWidth * (length % this.numPerPage);
		}
		if (Math.abs(nextOffset) >= this.ttlOffset) {
			nextOffset = 0;
		}
		document.querySelector('.imgContainer').style.transform = `translate(${nextOffset}px)`;
		this.curOffset = nextOffset;
	}

}


