_.mixin({
	thumbs : function () {
		this.size = function (f) {
			this.nc = f || this.nc;
			this.close_btn.x = panel.w - this.close_btn.w;
			this.offset = 0;
			switch (true) {
			case panel.w < this.px || panel.h < this.px || this.modes[this.mode] == "off":
				this.nc = true;
				_.dispose(this.img);
				this.img = null;
				this.w = 0;
				this.h = 0;
				break;
			case this.modes[this.mode] == "grid":
				this.x = 0;
				this.y = 0;
				this.w = panel.w;
				this.h = panel.h;
				if (!this.nc && this.columns != _.floor(this.w / this.px))
					this.nc = true;
				this.rows = _.ceil(this.h / this.px);
				this.columns = _.floor(this.w / this.px);
				this.img_rows = _.ceil(this.images.length / this.columns);
				if (this.nc && this.images.length) {
					this.nc = false;
					_.dispose(this.img);
					this.img = null;
					this.img = gdi.CreateImage(Math.min(this.columns, this.images.length) * this.px, this.img_rows * this.px);
					var temp_gr = this.img.GetGraphics();
					var ci = 0;
					for (var row = 0; row < this.img_rows; row++) {
						for (var col = 0; col < this.columns; col++) {
							_.drawImage(temp_gr, this.images[ci], col * this.px, row * this.px, this.px, this.px, image.crop_top);
							ci++;
						};
					};
					this.img.ReleaseGraphics(temp_gr);
					temp_gr = null;
				}
				break;
			case this.modes[this.mode] == "left":
			case this.modes[this.mode] == "right":
				this.x = this.modes[this.mode] == "left" ? 0 : panel.w - this.px;
				this.y = 0;
				this.w = this.px;
				this.h = panel.h;
				this.rows = _.ceil(this.h / this.px);
				if (this.nc && this.images.length) {
					this.nc = false;
					_.dispose(this.img);
					this.img = null;
					this.img = gdi.CreateImage(this.px, this.px * this.images.length);
					var temp_gr = this.img.GetGraphics();
					_.forEach(this.images, function (item, i) {
						_.drawImage(temp_gr, item, 0, i * this.px, this.px, this.px, image.crop_top);
					}, this);
					this.img.ReleaseGraphics(temp_gr);
					temp_gr = null;
				}
				break;
			case this.modes[this.mode] == "top":
			case this.modes[this.mode] == "bottom":
				this.x = 0;
				this.y = this.modes[this.mode] == "top" ? 0 : panel.h - this.px;
				this.w = panel.w;
				this.h = this.px;
				this.columns = _.ceil(this.w / this.px);
				if (this.nc && this.images.length) {
					this.nc = false;
					_.dispose(this.img);
					this.img = null;
					this.img = gdi.CreateImage(this.px * this.images.length, this.px);
					var temp_gr = this.img.GetGraphics();
					_.forEach(this.images, function (item, i) {
						_.drawImage(temp_gr, item, i * this.px, 0, this.px, this.px, image.crop_top);
					}, this);
					this.img.ReleaseGraphics(temp_gr);
					temp_gr = null;
				}
				break;
			}
		}
		
		this.paint = function (gr) {
			switch (true) {
			case !this.images.length:
				this.image_xywh = [];
				break;
			case this.modes[this.mode] == "off":
				if (this.aspect == image.centre)
					this.image_xywh = _.drawImage(gr, this.images[this.image], 20, 20, panel.w - 40, panel.h - 40, this.aspect);
				else
					this.image_xywh = _.drawImage(gr, this.images[this.image], 0, 0, panel.w, panel.h, this.aspect);
				break;
			case !this.img:
				break;
			case this.modes[this.mode] == "grid":
				gr.DrawImage(this.img, this.x, this.y, this.w, this.h, 0, this.offset * this.px, this.w, this.h);
				if (this.overlay) {
					_.drawOverlay(gr, this.x, this.y, this.w, this.h);
					this.image_xywh = _.drawImage(gr, this.images[this.image], 20, 20, panel.w - 40, panel.h - 40, image.centre);
					this.close_btn.paint(gr, _.RGB(230, 230, 230));
				} else {
					this.image_xywh = [];
				}
				break;
			case this.modes[this.mode] == "left":
				if (this.aspect == image.centre)
					this.image_xywh = _.drawImage(gr, this.images[this.image], this.px + 20, 20, panel.w - this.px - 40, panel.h - 40, this.aspect);
				else
					this.image_xywh = _.drawImage(gr, this.images[this.image], 0, 0, panel.w, panel.h, this.aspect);
				_.drawOverlay(gr, this.x, this.y, this.w, this.h);
				gr.DrawImage(this.img, this.x, this.y, this.w, this.h, 0, this.offset * this.px, this.w, this.h);
				break;
			case this.modes[this.mode] == "right":
				if (this.aspect == image.centre)
					this.image_xywh = _.drawImage(gr, this.images[this.image], 20, 20, panel.w - this.px - 40, panel.h - 40, this.aspect);
				else
					this.image_xywh = _.drawImage(gr, this.images[this.image], 0, 0, panel.w, panel.h, this.aspect);
				_.drawOverlay(gr, this.x, this.y, this.w, this.h);
				gr.DrawImage(this.img, this.x, this.y, this.w, this.h, 0, this.offset * this.px, this.w, this.h);
				break;
			case this.modes[this.mode] == "top":
				if (this.aspect == image.centre)
					this.image_xywh = _.drawImage(gr, this.images[this.image], 20, this.px + 20, panel.w - 40, panel.h - this.px - 40, this.aspect);
				else
					this.image_xywh = _.drawImage(gr, this.images[this.image], 0, 0, panel.w, panel.h, this.aspect);
				_.drawOverlay(gr, this.x, this.y, this.w, this.h);
				gr.DrawImage(this.img, this.x, this.y, this.w, this.h, this.offset * this.px, 0, this.w, this.h);
				break;
			case this.modes[this.mode] == "bottom":
				if (this.aspect == image.centre)
					this.image_xywh = _.drawImage(gr, this.images[this.image], 20, 20, panel.w - 40, panel.h - this.px - 40, this.aspect);
				else
					this.image_xywh = _.drawImage(gr, this.images[this.image], 0, 0, panel.w, panel.h, this.aspect);
				_.drawOverlay(gr, this.x, this.y, this.w, this.h);
				gr.DrawImage(this.img, this.x, this.y, this.w, this.h, this.offset * this.px, 0, this.w, this.h);
				break;
			}
		}
		
		this.metadb_changed = function () {
			switch (true) {
			case !panel.metadb:
				this.artist = "";
				this.folder = "";
				break;
			case this.source == 0: // last.fm
				var temp_artist = panel.tf(panel.artist_tf);
				if (this.artist == temp_artist)
					return;
				this.artist = temp_artist;
				this.folder = panel.new_artist_folder(this.artist);
				var np = fb.GetNowPlaying();
				if (np && this.auto_download && np.Compare(panel.metadb) && _.tagged(this.artist) && !_.getFiles(this.folder, this.exts).length) {
					var a = _.q(_.fbSanitise(this.artist));
					var n = _.round(_.now() / 1000);
					var t = utils.ReadINI(this.ini_file, "Timestamps", a, 0);
					if (n - t > ONE_DAY) {
						utils.WriteINI(this.ini_file, "Timestamps", a, n);
						this.download();
					}
				}
				break;
			case this.source == 1: // custom folder
				var temp_folder = panel.tf(this.custom_folder_tf.replace("%profile%", fb.ProfilePath));
				if (this.folder == temp_folder)
					return;
				this.folder = temp_folder;
				break;
			}
			this.update();
		}
		
		this.trace = function (x, y) {
			return x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h;
		}
		
		this.image_xywh_trace = function (x, y) {
			switch (true) {
			case !this.images.length:
			case this.modes[this.mode] == "grid" && !this.overlay:
			case this.modes[this.mode] != "grid" && this.trace(x, y):
				return false;
			default:
				return x > this.image_xywh[0] && x < this.image_xywh[0] + this.image_xywh[2] && y > this.image_xywh[1] && y < this.image_xywh[1] + this.image_xywh[3];
			}
		}
		
		this.wheel = function (s) {
			var offset = this.offset - s;
			switch (true) {
			case !this.trace(this.mx, this.my):
			case this.modes[this.mode] == "grid" && this.overlay:
				if (this.images.length < 2)
					return;
				this.image -= s;
				if (this.image < 0)
					this.image = this.images.length - 1;
				if (this.image >= this.images.length)
					this.image = 0;
				window.Repaint();
				return;
			case this.modes[this.mode] == "grid":
				if (this.img_rows < this.rows)
					return;
				if (offset < 0)
					offset = 0;
				if (offset > this.img_rows - this.rows)
					offset = this.img_rows - this.rows + 1;
				break;
			case this.modes[this.mode] == "left":
			case this.modes[this.mode] == "right":
				if (this.images.length < this.rows)
					return;
				if (offset < 0)
					offset = 0;
				if (offset + this.rows > this.images.length)
					offset = this.images.length - this.rows + 1;
				break;
			case this.modes[this.mode] == "top":
			case this.modes[this.mode] == "bottom":
				if (this.images.length < this.columns)
					return;
				if (offset < 0)
					offset = 0;
				if (offset + this.columns > this.images.length)
					offset = this.images.length - this.columns + 1;
				break;
			}
			if (this.offset != offset) {
				this.offset = offset;
				window.RepaintRect(this.x, this.y, this.w, this.h);
			}
		}
		
		this.move = function (x, y) {
			this.mx = x;
			this.my = y;
			this.index = this.images.length;
			switch (true) {
			case !this.trace(x, y):
				break;
			case this.modes[this.mode] == "grid":
				if (this.overlay)
					return window.SetCursor(this.close_btn.move(x, y) ? IDC_HAND : IDC_ARROW);
				var tmp = _.floor(x / this.px);
				if (tmp < this.columns)
					this.index = tmp + ((_.floor(y / this.px) + this.offset) * this.columns);
				break;
			case this.modes[this.mode] == "left":
			case this.modes[this.mode] == "right":
				this.index = _.floor(y / this.px) + this.offset;
				break;
			case this.modes[this.mode] == "top":
			case this.modes[this.mode] == "bottom":
				this.index = _.floor(x / this.px) + this.offset;
				break;
			}
			window.SetCursor(this.index < this.images.length ? IDC_HAND : IDC_ARROW);
		}
		
		this.lbtn_up = function (x, y) {
			switch (true) {
			case !this.trace(x, y):
			case this.modes[this.mode] == "grid" && this.overlay && this.close_btn.lbtn_up(x, y):
				break;
			case this.modes[this.mode] == "grid" && !this.overlay && this.index < this.images.length:
				this.image = this.index;
				this.enable_overlay(true);
				break;
			case this.index < this.images.length:
				if (this.image != this.index) {
					this.image = this.index;
					window.Repaint();
				}
				break;
			}
		}
		
		this.lbtn_dblclk = function (x, y) {
			if (this.image_xywh_trace(x, y))
				_.run(this.files[this.image]);
		}
		
		this.rbtn_up = function (x, y) {
			panel.m.AppendMenuItem(MF_STRING, 4000, "Last.fm artist art");
			panel.m.AppendMenuItem(MF_STRING, 4001, "Custom folder");
			panel.m.CheckMenuRadioItem(4000, 4001, this.source + 4000);
			panel.m.AppendMenuSeparator();
			switch (this.source) {
			case 0: // last.fm
				panel.m.AppendMenuItem(panel.metadb ? MF_STRING : MF_GRAYED, 4002, "Download now");
				panel.s10.AppendMenuItem(MF_GRAYED, 4003, "Automatic download");
				panel.s10.AppendMenuItem(MF_STRING, 4004, "On");
				panel.s10.AppendMenuItem(MF_STRING, 4005, "Off");
				panel.s10.CheckMenuRadioItem(4004, 4005, this.auto_download ? 4004 : 4005);
				panel.s10.AppendMenuSeparator();
				panel.s10.AppendMenuItem(MF_GRAYED, 4009, "Limit");
				_.forEach(this.download_limits, function (item) {
					panel.s10.AppendMenuItem(MF_STRING, item + 4010, item);
				});
				panel.s10.CheckMenuRadioItem(_.first(this.download_limits) + 4010, _.last(this.download_limits) + 4010, this.download_limit + 4010);
				panel.s10.AppendTo(panel.m, MF_STRING, "Server options");
				break;
			case 1: // custom folder
				panel.m.AppendMenuItem(MF_STRING, 4040, "Refresh");
				panel.m.AppendMenuItem(MF_STRING, 4041, "Set custom folder...");
				break;
			}
			panel.m.AppendMenuSeparator();
			if (!panel.text_objects.length && !panel.list_objects.length) {
				_.forEach(this.modes, function (item, i) {
					panel.s11.AppendMenuItem(MF_STRING, i + 4050, _.capitalize(item));
				});
				panel.s11.CheckMenuRadioItem(4050, 4055, this.mode + 4050);
				panel.s11.AppendMenuSeparator();
				var flag = this.modes[this.mode] == "off" ? MF_GRAYED : MF_STRING;
				_.forEach(this.pxs, function (item) {
					panel.s11.AppendMenuItem(flag, item + 4100, item + "px");
				});
				panel.s11.CheckMenuRadioItem(_.first(this.pxs) + 4100, _.last(this.pxs) + 4100, this.px + 4100);
				panel.s11.AppendTo(panel.m, MF_STRING, "Thumbs");
				panel.m.AppendMenuSeparator();
			}
			panel.s12.AppendMenuItem(MF_STRING, 4060, "Off");
			panel.s12.AppendMenuItem(MF_STRING, 4065, "5 seconds");
			panel.s12.AppendMenuItem(MF_STRING, 4070, "10 seconds");
			panel.s12.AppendMenuItem(MF_STRING, 4080, "20 seconds");
			panel.s12.CheckMenuRadioItem(4060, 4080, this.cycle + 4060);
			panel.s12.AppendTo(panel.m, MF_STRING, "Cycle");
			panel.m.AppendMenuSeparator();
			panel.s13.AppendMenuItem(MF_STRING, 4500, "Newest first");
			panel.s13.AppendMenuItem(MF_STRING, 4501, "A-Z");
			panel.s13.CheckMenuRadioItem(4500, 4501, this.sort + 4500);
			panel.s13.AppendTo(panel.m, MF_STRING, "Sort");
			panel.m.AppendMenuSeparator();
			if (this.image_xywh_trace(x, y)) {
				if (this.modes[this.mode] != "grid") {
					panel.m.AppendMenuItem(MF_STRING, 4520, "Crop (focus on centre)");
					panel.m.AppendMenuItem(MF_STRING, 4521, "Crop (focus on top)");
					panel.m.AppendMenuItem(MF_STRING, 4522, "Stretch");
					panel.m.AppendMenuItem(MF_STRING, 4523, "Centre");
					panel.m.CheckMenuRadioItem(4520, 4523, this.aspect + 4520);
					panel.m.AppendMenuSeparator();
				}
				if (this.source == 0 && this.images.length > 1) {
					panel.m.AppendMenuItem(this.default_file == this.files[this.image] ? MF_GRAYED : MF_STRING, 4530, "Set as default");
					panel.m.AppendMenuItem(MF_STRING, 4531, "Clear default");
					panel.m.AppendMenuSeparator();
				}
				panel.m.AppendMenuItem(MF_STRING, 4511, "Open image");
				panel.m.AppendMenuItem(MF_STRING, 4512, "Delete image");
				panel.m.AppendMenuSeparator();
			}
			panel.m.AppendMenuItem(_.isFolder(this.folder) ? MF_STRING : MF_GRAYED, 4510, "Open containing folder");
			panel.m.AppendMenuSeparator();
		}
		
		this.rbtn_up_done = function (idx) {
			switch (idx) {
			case 4000:
			case 4001:
				this.source = idx - 4000;
				window.SetProperty("2K3.THUMBS.SOURCE", this.source);
				this.artist = "";
				this.folder = "";
				panel.item_focus_change();
				break;
			case 4002:
				this.download();
				break;
			case 4004:
			case 4005:
				this.auto_download = idx == 4004;
				window.SetProperty("2K3.THUMBS.AUTO.DOWNLOAD", this.auto_download);
				break;
			case 4011:
			case 4013:
			case 4015:
			case 4020:
			case 4025:
			case 4030:
				this.download_limit = idx - 4010;
				window.SetProperty("2K3.THUMBS.NEW.DOWNLOAD.LIMIT", this.download_limit);
				break;
			case 4040:
				this.update();
				break;
			case 4041:
				this.custom_folder_tf = _.input("Enter title formatting or an absolute path to a folder.\n\n%profile% will resolve to your foobar2000 profile folder or the program folder if using portable mode.", panel.name, this.custom_folder_tf);
				if (this.custom_folder_tf == "")
					this.custom_folder_tf = "$directory_path(%path%)";
				window.SetProperty("2K3.THUMBS.CUSTOM.FOLDER.TF", this.custom_folder_tf);
				this.folder = "";
				panel.item_focus_change();
				break;
			case 4050:
			case 4051:
			case 4052:
			case 4053:
			case 4054:
			case 4055:
				this.mode = idx - 4050;
				window.SetProperty("2K3.THUMBS.MODE", this.mode);
				this.size(true);
				window.Repaint();
				break;
			case 4060:
			case 4065:
			case 4070:
			case 4080:
				this.cycle = idx - 4060;
				window.SetProperty("2K3.THUMBS.CYCLE", this.cycle);
				break;
			case 4175:
			case 4200:
			case 4250:
			case 4300:
			case 4350:
			case 4400:
				this.px = idx - 4100;
				window.SetProperty("2K3.THUMBS.PX", this.px);
				this.size(true);
				window.Repaint();
				break;
			case 4500:
			case 4501:
				this.sort = idx - 4500;
				window.SetProperty("2K3.THUMBS.SORT", this.sort);
				if (this.images.length > 1)
					this.update();
				break;
			case 4510:
				if (this.files.length)
					_.explorer(this.files[this.image]);
				else
					_.run(this.folder);
				break;
			case 4511:
				_.run(this.files[this.image]);
				break;
			case 4512:
				this.delete_image();
				break;
			case 4520:
			case 4521:
			case 4522:
			case 4523:
				this.aspect = idx - 4520;
				window.SetProperty("2K3.THUMBS.ASPECT", this.aspect);
				window.Repaint();
				break;
			case 4530:
				this.set_default(this.files[this.image].split("\\").pop());
				break;
			case 4531:
				this.set_default("");
				break;
			}
		}
		
		this.key_down = function (k) {
			switch (k) {
			case VK_ESCAPE:
				if (this.modes[this.mode] == "grid" && this.overlay)
					this.enable_overlay(false);
				break;
			case VK_LEFT:
			case VK_UP:
				this.wheel(1);
				break
			case VK_RIGHT:
			case VK_DOWN:
				this.wheel(-1);
				break;
			}
		}
		
		this.update = function () {
			this.image = 0;
			_.map(this.images, _.dispose);
			this.files = _.getFiles(this.folder, this.exts, this.sort == 0);
			if (this.source == 0 && this.files.length > 1) {
				this.default_file = this.folder + utils.ReadINI(this.ini_file, "Defaults", _.q(_.fbSanitise(this.artist)));
				var tmp = _.indexOf(this.files, this.default_file);
				if (tmp > -1) {
					this.files.splice(tmp, 1);
					this.files.unshift(this.default_file);
				}
			}
			this.images = _.map(this.files, _.img);
			this.size(true);
			window.Repaint();
		}
		
		this.enable_overlay = function (b) {
			this.overlay = b;
			window.Repaint();
		}
		
		this.set_default = function (t) {
			utils.WriteINI(this.ini_file, "Defaults", _.q(_.fbSanitise(this.artist)), _.q(t));
			this.update();
		}
		
		this.delete_image = function () {
			_.recycleFile(this.files[this.image]);
			this.update();
		}
		
		this.download = function () {
			if (!_.tagged(this.artist))
				return;
			var base = this.folder + _.fbSanitise(this.artist) + "_";
			this.xmlhttp.open("GET", "http://www.last.fm/music/" + encodeURIComponent(this.artist) + "/+images", true);
			this.xmlhttp.setRequestHeader("If-Modified-Since", "Thu, 01 Jan 1970 00:00:00 GMT");
			this.xmlhttp.send();
			this.xmlhttp.onreadystatechange = _.bind(function () {
				if (this.xmlhttp.readyState == 4) {
					if (this.xmlhttp.status == 200)
						this.success(base);
					else
						console.log("HTTP error: " + this.xmlhttp.status);
				}
			}, this);
		}
		
		this.success = function (base) {
			_(_.getElementsByTagName(this.xmlhttp.responsetext, "img"))
				.filter({"className" : "image-list-image"})
				.take(this.download_limit)
				.forEach(function (item) {
					var url = item.src.replace("avatar170s/", "");
					var filename = base + url.substring(url.lastIndexOf("/") + 1) + ".jpg";
					_.runCmd("cscript //nologo " + _.q(folders.home + "download.vbs") + " " + _.q(url) + " " + _.q(filename), false);
				})
				.value();
		}
		
		this.interval_func = _.bind(function () {
			this.time++;
			if (this.cycle > 0 && this.images.length > 1 && this.time % this.cycle == 0) {
				this.image++;
				if (this.image == this.images.length)
					this.image = 0;
				window.Repaint();
			}
			if (this.source == 0 && this.time % 3 == 0 && _.getFiles(this.folder, this.exts).length != this.files.length)
				this.update();
		}, this);
		
		_.createFolder(folders.data);
		_.createFolder(folders.artists);
		_.createFolder(folders.settings);
		this.mx = 0;
		this.my = 0;
		this.files = [];
		this.images = [];
		this.modes = ["grid", "left", "right", "top", "bottom", "off"];
		this.pxs = [75, 100, 150, 200, 250, 300];
		this.download_limits = [1, 3, 5, 10, 15, 20];
		this.mode = window.GetProperty("2K3.THUMBS.MODE", 4); // bottom
		this.cycle = window.GetProperty("2K3.THUMBS.CYCLE", 0);
		this.aspect = window.GetProperty("2K3.THUMBS.ASPECT", image.crop_top);
		this.custom_folder_tf = window.GetProperty("2K3.THUMBS.CUSTOM.FOLDER.TF", "$directory_path(%path%)");
		this.px = window.GetProperty("2K3.THUMBS.PX", 75);
		this.sort = window.GetProperty("2K3.THUMBS.SORT", 0); // 0 newest first 1 a-z
		this.source = window.GetProperty("2K3.THUMBS.SOURCE", 0); // 0 last.fm 1 custom folder
		this.download_limit = window.GetProperty("2K3.THUMBS.NEW.DOWNLOAD.LIMIT", 10);
		this.auto_download = window.GetProperty("2K3.THUMBS.AUTO.DOWNLOAD", false);
		this.ini_file = folders.settings + "thumbs.ini";
		this.exts = "jpg|jpeg|png|gif";
		this.folder = "";
		this.default_file = "";
		this.artist = "";
		this.img = null;
		this.nc = false;
		this.image = 0;
		this.image_xywh = [];
		this.index = 0;
		this.time = 0;
		this.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		this.close_btn = new _.sb(guifx.close, 0, 0, 16, 16, _.bind(function () { return this.modes[this.mode] == "grid" && this.overlay; }, this), _.bind(function () { this.enable_overlay(false); }, this));
		window.SetInterval(this.interval_func, 1000);
	}
});
