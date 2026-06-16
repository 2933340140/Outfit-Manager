(function() {
	//#region src/ui/styles.js
	function injectStyles() {
		var old = document.getElementById("om-style-v4");
		if (old) old.parentNode.removeChild(old);
		var s = document.createElement("style");
		s.id = "om-style-v4";
		s.textContent = [
			"@keyframes om-fadein{from{opacity:0}to{opacity:1}}",
			"@keyframes om-sheet-up{from{transform:translateY(100%)}to{transform:translateY(0)}}",
			"@keyframes om-popin{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}",
			".om-light{--om-bg:#f2f2f5 !important;--om-bg2:#e8e8ec !important;--om-text:#1a1a1a !important;--om-border:#c8c8ce !important;--om-card-bg:#e8e8ec !important;--om-head-bg:#eaeaed !important;}",
			".om-dark{--om-bg:#16161a;--om-bg2:#1e1e24;--om-text:#eee;--om-border:rgba(255,255,255,.08);--om-card-bg:rgba(255,255,255,.05);--om-head-bg:rgba(0,0,0,.3);}",
			".om-overlay{position:fixed;top:0;left:0;right:0;bottom:0;width:100vw;height:100dvh;z-index:2147483647;",
			"background:var(--om-bg,var(--SmartThemeBackgroundColor,#16161a));",
			"color:var(--om-text,var(--SmartThemeBodyColor,#eee));",
			"display:flex;flex-direction:column;",
			"animation:om-fadein .18s ease;font-size:14px;}",
			".om-box{width:100%;height:100%;min-height:0;display:flex;flex-direction:column;overflow:hidden;}",
			".om-head{display:flex;align-items:center;gap:8px;padding:12px 15px;flex-shrink:0;",
			"border-bottom:1px solid rgba(127,127,127,.1);background:rgba(0,0,0,.12);}",
			".om-head-title{font-weight:700;font-size:1.05em;display:flex;align-items:center;gap:7px;flex:1;min-width:0;}",
			".om-head-title i{color:var(--SmartThemeQuoteColor,#7c6daf);}",
			".om-head-actions{display:flex;align-items:center;gap:4px;}",
			".om-icon-btn{cursor:pointer;background:none;border:none;opacity:.55;font-size:1.15em;",
			"width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;",
			"transition:.18s;color:inherit;flex-shrink:0;}",
			".om-icon-btn:hover{opacity:1;background:rgba(127,127,127,.12);color:var(--SmartThemeQuoteColor,#7c6daf);}",
			".om-theme-btn{cursor:pointer;background:rgba(127,127,127,.1);border:1px solid rgba(127,127,127,.2);",
			"border-radius:14px;padding:4px 10px;font-size:.75em;display:flex;align-items:center;gap:5px;",
			"transition:.2s;color:inherit;flex-shrink:0;height:28px;white-space:nowrap;}",
			".om-theme-btn:hover{background:rgba(127,127,127,.2);}",
			,
			".om-search-bar{display:none;padding:8px 15px;border-bottom:1px solid rgba(127,127,127,.08);",
			"background:rgba(0,0,0,.06);flex-shrink:0;}",
			".om-search-bar.open{display:flex;align-items:center;gap:8px;}",
			".om-search-wrap{flex:1;position:relative;display:flex;align-items:center;}",
			".om-search-wrap i{position:absolute;left:10px;opacity:.4;font-size:.85em;pointer-events:none;}",
			".om-search-inp{width:100%;background:rgba(127,127,127,.08);border:1px solid rgba(127,127,127,.2);",
			"border-radius:8px;color:inherit;padding:7px 32px 7px 30px;font-size:.85em;font-family:inherit;box-sizing:border-box;}",
			".om-search-inp:focus{outline:none;border-color:var(--SmartThemeQuoteColor,#7c6daf);}",
			".om-search-clear{background:none;border:none;color:inherit;opacity:.4;cursor:pointer;font-size:.9em;padding:4px;line-height:1;}",
			".om-search-clear:hover{opacity:.9;}",
			".om-viewbar{display:flex;align-items:center;gap:6px;padding:8px 15px;flex-shrink:0;",
			"border-bottom:1px solid rgba(127,127,127,.08);}",
			".om-viewtab{padding:5px 16px;border-radius:18px;font-size:.78em;cursor:pointer;white-space:nowrap;",
			"border:1px solid rgba(127,127,127,.15);background:rgba(127,127,127,.06);transition:all .15s;color:inherit;font-family:inherit;}",
			".om-viewtab:hover{border-color:var(--SmartThemeQuoteColor,#7c6daf);}",
			".om-viewtab.on{background:var(--SmartThemeQuoteColor,#7c6daf);color:#fff;border-color:var(--SmartThemeQuoteColor,#7c6daf);font-weight:600;}",
			".om-char-sel{flex:1;min-width:0;background:rgba(127,127,127,.08);border:1px solid rgba(127,127,127,.2);",
			"border-radius:8px;color:inherit;padding:5px 10px;font-size:.78em;font-family:inherit;}",
			".om-char-sel:focus{outline:none;border-color:var(--SmartThemeQuoteColor,#7c6daf);}",
			".om-char-add-btn{background:none;border:1px solid rgba(127,127,127,.2);border-radius:8px;color:inherit;",
			"cursor:pointer;padding:5px 10px;font-size:.78em;white-space:nowrap;font-family:inherit;}",
			".om-char-add-btn:hover{border-color:var(--SmartThemeQuoteColor,#7c6daf);}",
			".om-char-input{flex:1;min-width:0;background:rgba(127,127,127,.08);border:1px solid rgba(127,127,127,.2);",
			"border-radius:8px;color:inherit;padding:5px 10px;font-size:.78em;font-family:inherit;box-sizing:border-box;}",
			".om-char-input:focus{outline:none;border-color:var(--SmartThemeQuoteColor,#7c6daf);}",
			".om-char-input::placeholder{opacity:.4;}",
			".om-char-dropdown{position:absolute;left:0;right:0;top:100%;z-index:50;",
			"background:var(--om-bg,#1a1a20);border-bottom:1px solid rgba(127,127,127,.15);",
			"max-height:50vh;overflow-y:auto;box-shadow:0 4px 16px rgba(0,0,0,.2);}",
			".om-light .om-char-dropdown{background:var(--om-bg,#f4f4f6);}",
			".om-char-group-hdr{display:flex;align-items:center;gap:6px;padding:7px 12px 4px;cursor:pointer;font-size:.78em;font-weight:600;opacity:.5;}",
			".om-char-group-hdr:hover{opacity:.7;}",
			".om-char-group-hdr i.om-g-arrow{font-size:.7em;transition:transform .15s;width:10px;text-align:center;}",
			".om-char-group-hdr i.om-g-arrow.collapsed{transform:rotate(-90deg);}",
			".om-char-group-hdr i.om-g-icon{font-size:.75em;opacity:.6;}",
			".om-char-row{display:flex;align-items:center;gap:8px;padding:9px 12px 9px 20px;cursor:pointer;",
			"transition:background .1s;font-size:.9em;}",
			".om-char-row:hover{background:rgba(127,127,127,.08);}",
			".om-char-row.active{background:rgba(124,109,175,.1);}",
			".om-char-star{cursor:pointer;opacity:.25;flex-shrink:0;width:20px;text-align:center;font-size:.85em;}",
			".om-char-star.on{opacity:.8;color:var(--SmartThemeQuoteColor,#7c6daf);}",
			".om-char-rname{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}",
			".om-char-count{font-size:.78em;opacity:.4;flex-shrink:0;min-width:28px;text-align:right;}",
			".om-char-actions{display:flex;gap:2px;flex-shrink:0;}",
			".om-char-act{background:none;border:none;color:inherit;cursor:pointer;opacity:.25;font-size:.82em;padding:3px 5px;border-radius:4px;transition:.15s;}",
			".om-char-act:hover{opacity:.85;background:rgba(127,127,127,.15);}",
			".om-char-act.om-char-delete:hover{opacity:1;color:#e57373;background:rgba(229,115,115,.12);}",
			".om-char-empty{text-align:center;opacity:.3;font-size:.85em;padding:18px 15px;}",
			".om-catbar{display:flex;gap:6px;padding:8px 15px;overflow-x:auto;flex-wrap:nowrap;flex-shrink:0;",
			"-webkit-overflow-scrolling:touch;scrollbar-width:none;",
			"border-bottom:1px solid rgba(127,127,127,.08);}",
			".om-catbar::-webkit-scrollbar{display:none;}",
			".om-catbtn{padding:5px 14px;border-radius:18px;font-size:.78em;cursor:pointer;white-space:nowrap;flex-shrink:0;",
			"border:1px solid rgba(127,127,127,.15);background:rgba(127,127,127,.06);transition:all .15s;color:inherit;font-family:inherit;}",
			".om-catbtn:hover{border-color:var(--SmartThemeQuoteColor,#7c6daf);color:var(--SmartThemeQuoteColor,#7c6daf);}",
			".om-catbtn.on{background:var(--SmartThemeQuoteColor,#7c6daf);color:#fff;border-color:var(--SmartThemeQuoteColor,#7c6daf);font-weight:600;}",
			".om-grid-area{flex:1;overflow-y:auto;padding:12px 12px 8px;}",
			".om-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(108px,1fr));gap:9px;}",
			".om-add-card{border:2px dashed rgba(127,127,127,.22);border-radius:10px;",
			"display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;",
			"cursor:pointer;opacity:.55;transition:all .2s;font-size:.8em;color:inherit;}",
			".om-add-card:hover{opacity:1;border-color:var(--SmartThemeQuoteColor,#7c6daf);",
			"color:var(--SmartThemeQuoteColor,#7c6daf);background:rgba(127,127,127,.04);}",
			".om-add-card i{font-size:1.4em;}",
			".om-batch-add-card{border:2px dashed rgba(127,127,127,.22);border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;cursor:pointer;opacity:.55;transition:all .2s;font-size:.8em;color:inherit;background:linear-gradient(135deg,rgba(124,109,175,.04) 0%,rgba(124,109,175,.01) 100%);}",
			".om-batch-add-card:hover{opacity:1;border-color:var(--SmartThemeQuoteColor,#7c6daf);color:var(--SmartThemeQuoteColor,#7c6daf);background:rgba(124,109,175,.08);}",
			".om-batch-add-card i{font-size:1.4em;}",
			".om-type-radios{display:flex;gap:12px;}",
			".om-radio-label{display:flex;align-items:center;gap:4px;font-size:.85em;cursor:pointer;opacity:.7;}",
			".om-radio-label:hover{opacity:1;}",
			".om-radio-label input[type=radio]{accent-color:var(--SmartThemeQuoteColor,#7c6daf);}",
			".om-card{border-radius:10px;overflow:hidden;position:relative;cursor:pointer;",
			"transition:all .18s;border:2px solid transparent;display:flex;flex-direction:column;}",
			".om-card:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,.25);}",
			".om-card.on{border-color:var(--SmartThemeQuoteColor,#7c6daf);",
			"box-shadow:0 0 0 1px var(--SmartThemeQuoteColor,#7c6daf),0 4px 16px rgba(0,0,0,.2);}",
			".om-card-img{width:100%;aspect-ratio:3/4;position:relative;background:rgba(127,127,127,.1);",
			"display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;}",
			".om-card-img img{width:100%;height:100%;object-fit:cover;display:block;}",
			"@media (hover:none){.om-card-menu{opacity:.75 !important;}}",
			".om-card-info{padding:5px 7px 6px;background:var(--om-card-bg,rgba(127,127,127,.06));min-height:36px;box-sizing:border-box;}",
			".om-card-name{font-size:.8em;font-weight:600;line-height:1.3;",
			"white-space:nowrap;overflow:hidden;text-overflow:ellipsis;",
			"color:var(--om-text,#eee);}",
			".om-card-tag{font-size:.68em;line-height:1.2;margin-top:2px;",
			"white-space:nowrap;overflow:hidden;text-overflow:ellipsis;",
			"color:var(--om-text,#aaa);opacity:.5;}",
			".om-card-noimg{display:flex;flex-direction:column;align-items:flex-start;gap:5px;",
			"width:100%;height:100%;justify-content:flex-start;padding:12px 12px 32px 12px;box-sizing:border-box;",
			"background:linear-gradient(135deg,rgba(127,127,127,.08) 0%,rgba(127,127,127,.03) 100%);}",
			".om-card-noimg .om-noimg-name{font-size:.88em;font-weight:700;line-height:1.3;",
			"display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;",
			"word-break:break-all;color:var(--om-text,#eee);}",
			".om-card-noimg .om-noimg-desc{font-size:.78em;line-height:1.45;opacity:.55;",
			"display:-webkit-box;-webkit-line-clamp:8;-webkit-box-orient:vertical;overflow:hidden;",
			"word-break:break-all;color:var(--om-text,#ccc);}",
			".om-card-noimg .om-noimg-icon{font-size:1.2em;opacity:.2;position:absolute;bottom:8px;right:8px;}",
			".om-card.no-img{background:var(--om-card-bg,rgba(127,127,127,.06));}",
			".om-card.no-img .om-card-info{display:none;}",
			".om-card.no-img .om-card-img{aspect-ratio:unset;flex:1;min-height:0;}",
			".om-badge-on{position:absolute;top:5px;right:5px;",
			"width:20px;height:20px;border-radius:50%;",
			"background:var(--SmartThemeQuoteColor,#7c6daf);color:#fff;",
			"display:flex;align-items:center;justify-content:center;font-size:.6em;",
			"box-shadow:0 2px 6px rgba(0,0,0,.3);}",
			".om-card-check{position:absolute;top:5px;left:5px;",
			"width:20px;height:20px;border-radius:6px;border:2px solid rgba(255,255,255,.7);",
			"background:rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;",
			"cursor:pointer;transition:.15s;z-index:2;}",
			".om-card-check.checked{background:var(--SmartThemeQuoteColor,#7c6daf);border-color:var(--SmartThemeQuoteColor,#7c6daf);}",
			".om-card-check i{font-size:.65em;color:#fff;opacity:0;transition:.12s;}",
			".om-card-check.checked i{opacity:1;}",
			".om-card.batch-sel{border:2px solid var(--SmartThemeQuoteColor,#7c6daf);}",
			".om-card-menu{position:absolute;bottom:5px;right:5px;",
			"width:20px;height:20px;border-radius:50%;",
			"background:rgba(0,0,0,.5);color:#fff;border:none;cursor:pointer;",
			"display:flex;align-items:center;justify-content:center;font-size:.55em;line-height:1;overflow:hidden;",
			"opacity:0;transition:opacity .18s;z-index:3;pointer-events:auto;",
			"backdrop-filter:blur(4px);box-shadow:0 2px 6px rgba(0,0,0,.3);}",
			".om-card:hover .om-card-menu,.om-card:active .om-card-menu{opacity:1;}",
			".om-card-menu:hover{background:rgba(0,0,0,.75);}",
			".om-batch-bar{display:flex;align-items:center;gap:6px;padding:8px 10px;",
			"background:rgba(124,109,175,.08);border:1px solid rgba(124,109,175,.2);",
			"border-radius:10px;margin-bottom:10px;flex-wrap:nowrap;overflow-x:auto;",
			"-webkit-overflow-scrolling:touch;scrollbar-width:none;}",
			".om-batch-bar::-webkit-scrollbar{display:none;}",
			".om-batch-info{font-size:.82em;font-weight:600;color:var(--SmartThemeQuoteColor,#7c6daf);white-space:nowrap;flex-shrink:0;}",
			".om-batch-acts{display:flex;gap:5px;flex-shrink:0;flex-wrap:nowrap;}",
			".om-batch-btn{padding:5px 10px;border-radius:6px;border:1px solid rgba(127,127,127,.2);",
			"background:rgba(127,127,127,.07);color:inherit;cursor:pointer;font-size:.78em;",
			"font-family:inherit;transition:.15s;white-space:nowrap;flex-shrink:0;}",
			".om-batch-btn:hover{background:rgba(127,127,127,.15);border-color:var(--SmartThemeQuoteColor,#7c6daf);color:var(--SmartThemeQuoteColor,#7c6daf);}",
			".om-batch-btn.danger{color:#e57373;border-color:rgba(229,115,115,.35);}",
			".om-batch-btn.danger:hover{background:#e57373;color:#fff;border-color:#e57373;}",
			".om-empty{text-align:center;padding:40px 0;opacity:.45;display:flex;flex-direction:column;gap:10px;align-items:center;font-size:.88em;}",
			".om-empty i{font-size:2.6em;}",
			".om-quick-scenes{display:flex;align-items:center;gap:8px;padding:8px 15px;border-bottom:1px solid rgba(127,127,127,.08);flex-shrink:0;overflow-x:auto;scrollbar-width:none;background:linear-gradient(90deg,rgba(127,127,127,.08),rgba(127,127,127,.02));}.om-quick-scenes::-webkit-scrollbar{display:none;}.om-quick-title{font-size:.76em;opacity:.65;white-space:nowrap;flex:0 0 auto;}.om-quick-panel{display:flex;align-items:center;gap:6px;flex-wrap:nowrap;}.om-quick-scene-btn{font-size:.76em;padding:5px 12px;border-radius:999px;border:1px solid rgba(127,127,127,.25);background:rgba(127,127,127,.08);color:inherit;cursor:pointer;white-space:nowrap;transition:all .15s;flex:0 0 auto;}.om-quick-scene-btn:hover{background:var(--SmartThemeQuoteColor,#7c6daf);color:#fff;border-color:var(--SmartThemeQuoteColor,#7c6daf);transform:translateY(-1px);}.om-bottombar{display:flex !important;align-items:center;gap:6px;padding:10px 14px;flex-shrink:0;",
			"border-top:1px solid rgba(127,127,127,.1);background:rgba(0,0,0,.12);}",
			".om-bottom-status{flex:1;min-width:0;display:flex;align-items:center;gap:7px;",
			"cursor:pointer;border-radius:8px;padding:5px 7px;transition:.15s;",
			"border:1px solid transparent;}",
			".om-bottom-status:hover{background:rgba(127,127,127,.08);border-color:rgba(127,127,127,.12);}",
			".om-status-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}",
			".om-status-dot.gray{background:rgba(127,127,127,.5);}",
			".om-status-dot.green{background:#4caf50;}",
			".om-status-dot.orange{background:#ff8c42;}",
			".om-status-text{font-size:.82em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:.9;}",
			".om-status-clear{margin-left:4px;background:none;border:none;font-size:.75em;color:inherit;",
			"opacity:.5;cursor:pointer;white-space:nowrap;padding:2px 5px;border-radius:4px;font-family:inherit;flex-shrink:0;}",
			".om-status-clear:hover{opacity:1;background:rgba(127,127,127,.1);}",
			".om-bottom-btn{width:36px;height:36px;border-radius:50%;border:1px solid rgba(127,127,127,.15);",
			"background:rgba(127,127,127,.06);color:inherit;cursor:pointer;",
			"display:flex;align-items:center;justify-content:center;font-size:.9em;",
			"transition:.18s;flex-shrink:0;}",
			".om-bottom-btn:hover{background:rgba(127,127,127,.15);border-color:var(--SmartThemeQuoteColor,#7c6daf);",
			"color:var(--SmartThemeQuoteColor,#7c6daf);}",
			".om-batch-toggle-btn{padding:6px 11px;border-radius:18px;border:1px solid rgba(127,127,127,.2);",
			"background:rgba(127,127,127,.07);color:inherit;cursor:pointer;font-size:.75em;",
			"white-space:nowrap;font-family:inherit;transition:.15s;flex-shrink:0;}",
			".om-batch-toggle-btn:hover{border-color:var(--SmartThemeQuoteColor,#7c6daf);color:var(--SmartThemeQuoteColor,#7c6daf);}",
			".om-batch-toggle-btn.on{background:var(--SmartThemeQuoteColor,#7c6daf);color:#fff;border-color:var(--SmartThemeQuoteColor,#7c6daf);}",
			".om-detail-panel{position:absolute;bottom:0;left:0;right:0;",
			"background:var(--om-bg2,var(--SmartThemeBackgroundColor,rgba(28,28,32,1)));",
			"border-radius:16px 16px 0 0;padding:14px 16px 16px;",
			"box-shadow:0 -4px 24px rgba(0,0,0,.3);",
			"animation:om-sheet-up .22s ease;border-top:1px solid rgba(127,127,127,.15);}",
			".om-detail-handle{width:32px;height:4px;border-radius:2px;",
			"background:rgba(127,127,127,.25);margin:0 auto 12px;}",
			".om-detail-title{font-size:.78em;font-weight:700;opacity:.55;text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px;}",
			".om-detail-tags{display:flex;flex-wrap:wrap;gap:6px;}",
			".om-detail-tag{display:inline-flex;align-items:center;gap:5px;",
			"padding:4px 6px 4px 10px;border-radius:14px;",
			"background:var(--SmartThemeQuoteColor,#7c6daf);color:#fff;font-size:.78em;font-weight:600;}",
			".om-detail-tag-x{background:none;border:none;color:#fff;cursor:pointer;",
			"font-size:.9em;line-height:1;padding:0 2px;opacity:.75;font-family:inherit;}",
			".om-detail-tag-x:hover{opacity:1;}",
			".om-sheet-overlay{position:absolute !important;inset:0 !important;z-index:1 !important;background:rgba(0,0,0,.45) !important;pointer-events:auto !important;}",
			".om-sheet{position:absolute;bottom:0;left:0;right:0;max-height:88vh;max-height:88dvh;",
			"background:var(--om-bg2,var(--SmartThemeBackgroundColor,#1a1a1e));",
			"color:var(--om-text,var(--SmartThemeBodyColor,#eee));",
			"border-radius:18px 18px 0 0;overflow-y:auto;",
			"animation:om-sheet-up .25s ease;border:1px solid rgba(127,127,127,.15);border-bottom:none;}",
			".om-sheet-handle{width:36px;height:4px;border-radius:2px;",
			"background:rgba(127,127,127,.25);margin:10px auto 4px;}",
			".om-sheet-content{padding:4px 20px 32px;}",
			".om-sheet-title{font-weight:700;font-size:1.05em;padding:10px 0 14px;",
			"display:flex;align-items:center;gap:8px;}",
			".om-sheet-title i{color:var(--SmartThemeQuoteColor,#7c6daf);}",
			".om-ctx-item{display:flex;align-items:center;gap:12px;padding:14px 4px;",
			"cursor:pointer;border-bottom:1px solid rgba(127,127,127,.08);transition:.15s;border-radius:0;}",
			".om-ctx-item:last-child{border-bottom:none;}",
			".om-ctx-item:hover{color:var(--SmartThemeQuoteColor,#7c6daf);}",
			".om-ctx-item i{width:20px;text-align:center;opacity:.75;font-size:1em;}",
			".om-ctx-item.danger{color:#e57373;}",
			".om-ctx-item.danger:hover{color:#ef5350;}",
			".om-ctx-outfit-name{font-size:.85em;opacity:.5;padding:2px 0 10px;",
			"border-bottom:1px solid rgba(127,127,127,.1);margin-bottom:4px;}",
			".om-sec-title{font-size:.75em;font-weight:700;opacity:.55;text-transform:uppercase;",
			"letter-spacing:.07em;padding:10px 0 7px;}",
			".om-divider{height:1px;background:rgba(127,127,127,.12);margin:6px 0 12px;}",
			".om-hint{font-size:.76em;opacity:.5;line-height:1.4;}",
			".om-btn-row{display:flex;gap:8px;flex-wrap:wrap;}",
			".om-btn{padding:8px 16px;border-radius:8px;border:none;cursor:pointer;",
			"font-size:.87em;font-weight:600;transition:.18s;font-family:inherit;}",
			".om-btn-safe{background:var(--SmartThemeQuoteColor,#7c6daf);color:#fff;}",
			".om-btn-safe:hover{filter:brightness(1.1);box-shadow:0 3px 10px rgba(0,0,0,.15);}",
			".om-btn-outline{background:rgba(127,127,127,.08);border:1px solid rgba(127,127,127,.22);color:inherit;}",
			".om-btn-outline:hover{background:rgba(127,127,127,.15);border-color:var(--SmartThemeQuoteColor,#7c6daf);color:var(--SmartThemeQuoteColor,#7c6daf);}",
			".om-btn-danger{background:rgba(229,115,115,.1);border:1px solid #e57373;color:#e57373;}",
			".om-btn-danger:hover{background:#e57373;color:#fff;}",
			".om-setting-row{display:flex;flex-direction:column;gap:5px;margin-bottom:4px;}",
			".om-setting-row label{font-size:.8em;opacity:.7;}",
			".om-setting-row select,.om-setting-row textarea{background:rgba(127,127,127,.08);",
			"border:1px solid rgba(127,127,127,.2);border-radius:8px;color:inherit;",
			"padding:7px 10px;font-size:.85em;width:100%;box-sizing:border-box;resize:vertical;font-family:inherit;}",
			".om-setting-row select:focus,.om-setting-row textarea:focus{outline:none;border-color:var(--SmartThemeQuoteColor,#7c6daf);}",
			".om-row-inline{flex-direction:row!important;align-items:center;justify-content:space-between;}",
			".om-row-inline label{opacity:.8;font-size:.88em;}",
			".om-chk{width:17px;height:17px;accent-color:var(--SmartThemeQuoteColor,#7c6daf);cursor:pointer;}",
			".om-storage-info{font-size:.72em;opacity:.45;padding:4px 0;}",
			".om-field{display:flex;flex-direction:column;gap:5px;margin-bottom:10px;}",
			".om-field label{font-size:.8em;opacity:.7;font-weight:500;}",
			".om-field input[type=text],.om-field select,.om-field textarea{",
			"background:rgba(127,127,127,.08);border:1px solid rgba(127,127,127,.2);",
			"border-radius:8px;color:inherit;padding:9px 11px;font-size:.9em;width:100%;box-sizing:border-box;font-family:inherit;}",
			".om-field textarea{resize:none;}",
			".om-field input:focus,.om-field select:focus,.om-field textarea:focus{outline:none;border-color:var(--SmartThemeQuoteColor,#7c6daf);}",
			".om-frow{display:flex;gap:7px;align-items:stretch;}",
			".om-frow select{flex:1;}",
			".om-imgarea{width:100%;height:160px;background:rgba(127,127,127,.06);",
			"border:2px dashed rgba(127,127,127,.25);border-radius:10px;",
			"display:flex;align-items:center;justify-content:center;cursor:pointer;overflow:hidden;transition:border-color .18s;}",
			".om-imgarea:hover,.om-imgarea.drag{border-color:var(--SmartThemeQuoteColor,#7c6daf);background:rgba(127,127,127,.1);}",
			".om-imgph{display:flex;flex-direction:column;align-items:center;gap:6px;opacity:.4;font-size:.82em;pointer-events:none;}",
			".om-imgph i{font-size:1.8em;}",
			".om-imgarea img{width:100%;height:100%;object-fit:contain;}",
			".om-img-actions{display:flex;gap:7px;margin-top:7px;}",
			".om-edit-foot{display:flex;gap:9px;justify-content:flex-end;padding-top:14px;",
			"border-top:1px solid rgba(127,127,127,.1);margin-top:10px;}",
			".om-suggest-wrap{position:relative;width:100%;}",
			".om-suggest-wrap input{width:100%;box-sizing:border-box;}",
			".om-suggest-list{position:absolute;top:100%;left:0;right:0;",
			"background:var(--om-bg2,var(--SmartThemeBackgroundColor,rgba(40,40,40,.98)));",
			"border:1px solid rgba(127,127,127,.22);border-radius:8px;margin-top:3px;",
			"z-index:200;max-height:160px;overflow-y:auto;box-shadow:0 6px 20px rgba(0,0,0,.25);}",
			".om-suggest-item{padding:8px 12px;font-size:.85em;cursor:pointer;transition:.12s;color:var(--SmartThemeBodyColor,inherit);}",
			".om-suggest-item:hover{background:rgba(127,127,127,.15);color:var(--SmartThemeQuoteColor,#7c6daf);}",
			".om-cat-item{display:flex;align-items:center;gap:8px;padding:9px 12px;",
			"background:rgba(127,127,127,.06);border-radius:9px;",
			"border:1px solid rgba(127,127,127,.1);transition:all .15s;margin-bottom:7px;}",
			".om-cat-item:hover{background:rgba(127,127,127,.11);}",
			".om-cat-name{flex:1;font-size:.88em;}",
			".om-cat-count{font-size:.74em;opacity:.45;}",
			".om-cat-add-row{display:flex;gap:8px;}",
			".om-cat-add-row input{flex:1;background:rgba(127,127,127,.08);border:1px solid rgba(127,127,127,.2);",
			"border-radius:8px;color:inherit;padding:8px 11px;font-size:.88em;font-family:inherit;box-sizing:border-box;}",
			".om-cat-add-row input:focus{outline:none;border-color:var(--SmartThemeQuoteColor,#7c6daf);}",
			".om-preset-item{display:flex;align-items:center;gap:8px;padding:10px 14px;",
			"background:rgba(127,127,127,.06);border-radius:9px;border:1px solid rgba(127,127,127,.1);",
			"transition:all .15s;cursor:pointer;margin-bottom:7px;}",
			".om-preset-item:hover{background:rgba(127,127,127,.12);border-color:var(--SmartThemeQuoteColor,#7c6daf);}",
			".om-preset-name{flex:1;font-size:.9em;font-weight:600;}",
			".om-preset-count{font-size:.74em;opacity:.5;white-space:nowrap;}",
			".om-preset-item.current{border-color:var(--SmartThemeQuoteColor,#7c6daf);background:rgba(124,109,175,.08);}",
			".om-btn-sm{padding:5px 7px;border-radius:6px;cursor:pointer;font-size:.78em;",
			"background:rgba(127,127,127,.07);border:1px solid rgba(127,127,127,.14);",
			"transition:all .15s;color:inherit;font-family:inherit;}",
			".om-btn-sm:hover{background:rgba(127,127,127,.15);}",
			".om-modal{position:absolute;inset:0;z-index:2;background:rgba(0,0,0,.45);pointer-events:auto;",
			"display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;}",
			".om-modal-box{background:var(--om-bg2,var(--SmartThemeBackgroundColor,rgba(30,30,30,1)));",
			"color:var(--om-text,var(--SmartThemeBodyColor,#eee));border-radius:16px;padding:22px 20px 26px;",
			"width:100%;max-width:400px;max-height:85vh;overflow-y:auto;",
			"display:flex;flex-direction:column;gap:10px;",
			"box-shadow:0 8px 32px rgba(0,0,0,.4);margin:auto;border:1px solid rgba(127,127,127,.15);}",
			".om-modal-title{font-weight:700;font-size:1em;margin-bottom:4px;}",
			".om-modal-btn{padding:10px 14px;border-radius:9px;border:1px solid rgba(127,127,127,.2);",
			"background:rgba(127,127,127,.07);color:inherit;cursor:pointer;font-size:.88em;text-align:left;",
			"font-family:inherit;transition:.15s;}",
			".om-modal-btn:hover{background:rgba(127,127,127,.16);border-color:var(--SmartThemeQuoteColor,#7c6daf);color:var(--SmartThemeQuoteColor,#7c6daf);}",
			".om-modal-cancel{padding:9px;border-radius:9px;border:none;background:none;",
			"color:inherit;cursor:pointer;font-size:.85em;opacity:.5;font-family:inherit;margin-top:4px;}",
			".om-modal-cancel:hover{opacity:1;}",
			".om-lightbox{position:absolute;inset:0;z-index:3;background:rgba(0,0,0,.92);pointer-events:auto;",
			"display:flex;align-items:center;justify-content:center;animation:om-popin .18s ease;}",
			".om-lb-img{max-width:92vw;max-height:88vh;object-fit:contain;border-radius:10px;",
			"box-shadow:0 8px 40px rgba(0,0,0,.6);user-select:none;}",
			".om-lb-close{position:absolute;top:18px;right:20px;background:rgba(255,255,255,.12);",
			"border:none;color:#fff;font-size:1.3em;width:40px;height:40px;border-radius:50%;",
			"cursor:pointer;display:flex;align-items:center;justify-content:center;transition:.15s;z-index:2147483647;}",
			".om-lb-close:hover{background:rgba(255,255,255,.25);}",
			".om-lb-nav{position:absolute;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.12);",
			"border:none;color:#fff;font-size:1.2em;width:42px;height:42px;border-radius:50%;",
			"cursor:pointer;display:flex;align-items:center;justify-content:center;transition:.15s;z-index:2147483647;}",
			".om-lb-nav:hover{background:rgba(255,255,255,.25);}",
			".om-lb-prev{left:14px;} .om-lb-next{right:14px;}",
			".om-lb-counter{position:absolute;bottom:20px;left:50%;transform:translateX(-50%);",
			"color:rgba(255,255,255,.6);font-size:.82em;background:rgba(0,0,0,.4);",
			"padding:4px 14px;border-radius:20px;z-index:2147483647;}",
			".om-lb-name{position:absolute;top:20px;left:50%;transform:translateX(-50%);",
			"color:#fff;font-size:.9em;font-weight:600;background:rgba(0,0,0,.4);",
			"padding:5px 16px;border-radius:20px;max-width:60vw;white-space:nowrap;",
			"overflow:hidden;text-overflow:ellipsis;z-index:2147483647;}"
		].join("");
		document.head.appendChild(s);
	}
	//#endregion
	//#region src/constants.js
	var SCRIPT_NAME = "穿搭管理";
	var BTN_ID = "outfit-mgr-ext-btn-v4";
	var DB_NAME = "outfit_mgr_db";
	var STORE_NAME = "data";
	var DATA_KEY = "main";
	var SHARED_SETTINGS_KEY = "Outfit-Manager";
	var SHARED_DATA_KEY = "wardrobeData";
	var MAX_IMG_WIDTH = 1200;
	var IMG_QUALITY = .85;
	var FAB_ID = "om-fab-main";
	var LINGERIE_REGEX = /内衣|文胸|内裤|抹胸|蕾丝性感|法式三角杯|聚拢|丝绸奢华|基础纯棉|少女可爱/;
	function def() {
		return {
			outfits: [],
			categories: [],
			activeIds: [],
			virtualOutfits: {},
			presets: [],
			activePresetId: null,
			chars: {},
			charNames: [],
			charFavorites: [],
			charGroups: {},
			currentView: "user",
			selectedWorldBookNames: [],
			currentChar: "",
			showBall: true,
			mode: "text",
			injectPosition: "user",
			autoRollDisabled: false,
			singleTemplate: "[User当前穿着]\n{{description}}\n（禁止编造其他服装。严禁集中罗列服装信息，服装细节必须分散融入不同的动作、触感、环境互动中，每次只带出一两个细节。）",
			multiTemplate: "[User的可选穿搭]\n{{wardrobe}}\n（禁止编造以上之外的服装。根据场景标签匹配穿搭，若回复中出现场景转换则对应切换穿搭。严禁集中罗列服装信息，服装细节必须分散融入动作、触感、环境互动中，每次只带出一两个细节。）",
			charSingleTemplate: "[{{charName}}当前穿着]\n{{description}}\n（禁止编造其他服装。严禁集中罗列服装信息，服装细节必须分散融入不同的动作、触感、环境互动中，每次只带出一两个细节。）",
			charMultiTemplate: "[{{charName}}的可选穿搭]\n{{wardrobe}}\n（禁止编造以上之外的服装。根据场景标签匹配穿搭，若回复中出现场景转换则对应切换穿搭。严禁集中罗列服装信息，服装细节必须分散融入动作、触感、环境互动中，每次只带出一两个细节。）",
			imagePrompt: "图中为角色当前穿着，禁止编造其他服装。严禁集中罗列，服装细节必须分散融入动作、触感、环境互动中，每次只带出一两个细节。",
			multiImagePrompt: "以上图片为可选穿搭，根据场景标签匹配，场景转换则切换穿搭，禁止编造其他服装。严禁集中罗列，细节分散融入动作和互动中。",
			itemSingleTemplate: "[User单品衣柜]\n{{wardrobe}}\n（以上为当前可用的单品库存，禁止编造以上之外的服装单品。）",
			itemMultiTemplate: "[User穿搭+单品]\n{{outfits}}\n\n[单品衣柜]\n{{items}}\n（以上为当前穿搭和可用单品库存，禁止编造以上之外的服装。）",
			debug: false,
			useMainApi: true,
			lastAutoEnabledEntry: null,
			apiVision: {
				endpoint: "",
				key: "",
				model: "",
				concurrency: 1,
				prompt: "请用中文详细描述这张穿搭图片中的服装。包括：服装类型、颜色、材质、款式细节、搭配方式等。只描述服装本身，不描述人物外貌。每套穿搭的描述控制在100-200字。",
				overwrite: false,
				parsePrompt: "请逐件列出图中可见单品。格式：类别：描述。类别包括上装/下装/外套/鞋袜/配饰/包包。只列图中实际可见的。每件一行15-30字。",
				autoTagPrompt: "分析这张穿搭照片，用以下格式回复（简洁，不要解释）：\n名称：<5-15字>\n类型：套装 或 单品\n风格：选一个（学院/简约/运动/甜美/通勤/休闲/街头/优雅/舒适）\n季节：选一个（春/夏/秋/冬/全年）\n场景：选一个（外出/家居/办公/约会/运动/睡前）\n---\n<描述100-200字>"
			}
		};
	}
	//#endregion
	//#region src/core/migrate.js
	function migrateV17(d) {
		if (!d.outfits) return;
		var userOutfits = [];
		var moved = {};
		d.outfits.forEach(function(o) {
			if (o.owner && o.owner !== "user") {
				var cn = o.owner;
				if (!moved[cn]) moved[cn] = [];
				delete o.owner;
				moved[cn].push(o);
			} else {
				delete o.owner;
				userOutfits.push(o);
			}
		});
		d.outfits = userOutfits;
		if (!d.chars) d.chars = {};
		if (!d.virtualOutfits) d.virtualOutfits = {};
		if (!d.charNames) d.charNames = [];
		for (var cn in moved) {
			if (!d.chars[cn]) d.chars[cn] = {
				outfits: [],
				categories: [],
				activeIds: []
			};
			d.chars[cn].outfits = d.chars[cn].outfits.concat(moved[cn]);
			if (d.charNames.indexOf(cn) === -1) d.charNames.push(cn);
		}
		if (d.charActiveIds) {
			for (var cn2 in d.charActiveIds) {
				if (!d.chars[cn2]) d.chars[cn2] = {
					outfits: [],
					categories: [],
					activeIds: []
				};
				d.chars[cn2].activeIds = d.charActiveIds[cn2];
			}
			delete d.charActiveIds;
		}
	}
	//#endregion
	//#region src/ai/api-detect.js
	function autoDetectApiConfig(d) {
		try {
			if (typeof SillyTavern === "undefined" || !SillyTavern.getContext) return;
			var ctx = SillyTavern.getContext();
			var mainApi = ctx.mainApi || "";
			if (mainApi === "openai") {
				var cs = ctx.chatCompletionSettings || {};
				if (cs.chat_completion_source === "custom" && cs.custom_url) d.apiVision.endpoint = cs.custom_url;
				else if (cs.reverse_proxy) d.apiVision.endpoint = cs.reverse_proxy;
				if (ctx.getChatCompletionModel) try {
					d.apiVision.model = ctx.getChatCompletionModel(cs) || "";
				} catch (e) {}
				d._detectedApiType = "chat_completion";
				d._detectedSource = cs.chat_completion_source || "openai";
			} else if (mainApi === "textgenerationwebui") {
				var ts = ctx.textCompletionSettings || {};
				if (ctx.getTextGenServer) try {
					d.apiVision.endpoint = ctx.getTextGenServer() || "";
				} catch (e) {}
				var modelField = getModelFieldForTextGenType(ts.type);
				if (modelField && ts[modelField]) d.apiVision.model = ts[modelField];
				else if (ts.custom_model) d.apiVision.model = ts.custom_model;
				d._detectedApiType = "text_completion";
				d._detectedSource = ts.type || "unknown";
			} else if (mainApi === "novel") {
				d._detectedApiType = "novelai";
				d._detectedSource = "novel";
			} else if (mainApi === "kobold" || mainApi === "koboldhorde") {
				d._detectedApiType = "kobold";
				d._detectedSource = mainApi;
			}
		} catch (e) {}
	}
	function getModelFieldForTextGenType(type) {
		return {
			mancer: "mancer_model",
			vllm: "vllm_model",
			aphrodite: "aphrodite_model",
			tabby: "tabby_model",
			togetherai: "togetherai_model",
			llamacpp: "llamacpp_model",
			ollama: "ollama_model",
			infermaticai: "infermaticai_model",
			dreamgen: "dreamgen_model",
			openrouter: "openrouter_model",
			featherless: "featherless_model",
			generic: "generic_model"
		}[type] || null;
	}
	//#endregion
	//#region src/core/db.js
	var dbInstance = null;
	var dataCache = null;
	function getSTContextSafe() {
		try {
			return typeof SillyTavern !== "undefined" && SillyTavern.getContext ? SillyTavern.getContext() : null;
		} catch (e) {
			return null;
		}
	}
	function getSharedSettingsRoot() {
		var ctx = getSTContextSafe();
		if (!ctx) return null;
		if (!ctx.extensionSettings) ctx.extensionSettings = {};
		if (!ctx.extensionSettings["Outfit-Manager"]) ctx.extensionSettings[SHARED_SETTINGS_KEY] = {};
		return ctx.extensionSettings[SHARED_SETTINGS_KEY];
	}
	function loadFromSharedSettings() {
		var root = getSharedSettingsRoot();
		if (!root || !root["wardrobeData"]) return null;
		return root[SHARED_DATA_KEY];
	}
	function saveToSharedSettings(d) {
		var root = getSharedSettingsRoot();
		if (!root) return;
		root[SHARED_DATA_KEY] = d;
		var ctx = getSTContextSafe();
		if (ctx && ctx.saveSettingsDebounced) ctx.saveSettingsDebounced();
	}
	function hasWardrobeData(d) {
		if (!d) return false;
		if (d.outfits && d.outfits.length > 0) return true;
		if (d.chars) {
			for (var cn in d.chars) if (d.chars[cn].outfits && d.chars[cn].outfits.length > 0) return true;
		}
		if (d.activeIds && d.activeIds.length > 0) return true;
		return false;
	}
	function openDB(cb) {
		if (dbInstance) return cb(dbInstance);
		var req = indexedDB.open(DB_NAME, 1);
		req.onupgradeneeded = function(e) {
			var db = e.target.result;
			if (!db.objectStoreNames.contains("data")) db.createObjectStore(STORE_NAME);
		};
		req.onsuccess = function(e) {
			dbInstance = e.target.result;
			cb(dbInstance);
		};
		req.onerror = function() {
			cb(null);
		};
	}
	function loadFromDB(cb) {
		openDB(function(db) {
			var finish = function(d) {
				d = ensureDefaults(d);
				dataCache = d;
				if (!loadFromSharedSettings() && hasWardrobeData(d)) saveToSharedSettings(d);
				cb(d);
			};
			var shared = loadFromSharedSettings();
			if (shared && hasWardrobeData(shared)) return finish(shared);
			if (!db) return finish(loadFromLS());
			var req2 = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(DATA_KEY);
			req2.onsuccess = function() {
				var d = req2.result || null;
				if (!d || !hasWardrobeData(d)) {
					var ls = loadFromLS();
					if (ls && hasWardrobeData(ls)) d = ls;
				}
				finish(d);
			};
			req2.onerror = function() {
				finish(loadFromLS());
			};
		});
	}
	function saveToDB(d, cb) {
		saveToSharedSettings(d);
		try {
			localStorage.setItem("outfit_mgr_v4", JSON.stringify(d));
		} catch (e) {}
		try {
			localStorage.setItem("outfit_mgr_v4_backup", JSON.stringify(d));
		} catch (e) {}
		openDB(function(db) {
			if (!db) {
				if (cb) cb();
				return;
			}
			var tx = db.transaction(STORE_NAME, "readwrite");
			tx.objectStore(STORE_NAME).put(d, DATA_KEY);
			tx.oncomplete = function() {
				if (cb) cb();
			};
			tx.onerror = function() {
				if (cb) cb();
			};
		});
	}
	function load$1() {
		if (dataCache) return dataCache;
		var shared = loadFromSharedSettings();
		if (shared) return shared;
		return loadFromLS() || def();
	}
	function save$1(d) {
		dataCache = d;
		saveToDB(d);
	}
	function loadFromLS() {
		try {
			var r = localStorage.getItem("outfit_mgr_v4");
			if (r) return JSON.parse(r);
			var b = localStorage.getItem("outfit_mgr_v4_backup");
			if (b) return JSON.parse(b);
			return null;
		} catch (e) {
			return null;
		}
	}
	function ensureDefaults(d) {
		var dd = def();
		if (!d) return dd;
		for (var k in dd) if (d[k] === void 0) d[k] = dd[k];
		if (d.activeId && !d.activeIds) d.activeIds = [d.activeId];
		if (!Array.isArray(d.activeIds)) d.activeIds = [];
		if (!Array.isArray(d.presets)) d.presets = [];
		if (!d.chars) d.chars = {};
		if (!d.virtualOutfits) d.virtualOutfits = {};
		if (!d.selectedWorldBookNames || !Array.isArray(d.selectedWorldBookNames)) d.selectedWorldBookNames = [];
		if (!d.charNames) d.charNames = [];
		if (!d.apiVision) d.apiVision = def().apiVision;
		else {
			var dv = def().apiVision;
			for (var vk in dv) if (d.apiVision[vk] === void 0) d.apiVision[vk] = dv[vk];
			if (d.apiVision.batchSize && !d.apiVision.concurrency) d.apiVision.concurrency = Math.min(d.apiVision.batchSize, 5);
			delete d.apiVision.batchSize;
			if (d.useMainApi !== false) {
				d.useMainApi = true;
				autoDetectApiConfig(d);
			}
		}
		migrateV17(d);
		migrateImages(d);
		return d;
	}
	function migrateImages(d) {
		var convert = function(o) {
			if (o && o.imageData && !o.images) {
				o.images = [o.imageData];
				delete o.imageData;
			}
			if (o && !o.images) o.images = [];
		};
		(d.outfits || []).forEach(convert);
		if (d.chars) for (var cn in d.chars) (d.chars[cn].outfits || []).forEach(convert);
		if (d.virtualOutfits) for (var vid in d.virtualOutfits) convert(d.virtualOutfits[vid]);
		if (d.presets) d.presets.forEach(function(p) {
			if (p.outfits) p.outfits.forEach(convert);
		});
	}
	//#endregion
	//#region src/core/data.js
	function getCharData(d, charName) {
		if (!d.chars) d.chars = {};
		if (!d.virtualOutfits) d.virtualOutfits = {};
		if (!d.chars[charName]) d.chars[charName] = {
			outfits: [],
			categories: [],
			activeIds: []
		};
		return d.chars[charName];
	}
	function getViewOutfits(d) {
		if (d.currentView === "char" && d.currentChar) return getCharData(d, d.currentChar).outfits;
		return d.outfits;
	}
	function getViewCategories(d) {
		if (d.currentView === "char" && d.currentChar) return getCharData(d, d.currentChar).categories;
		return d.categories;
	}
	function getViewActiveIds(d) {
		if (d.currentView === "char" && d.currentChar) return getCharData(d, d.currentChar).activeIds;
		return d.activeIds;
	}
	function setViewActiveIds(d, ids) {
		if (d.currentView === "char" && d.currentChar) getCharData(d, d.currentChar).activeIds = ids;
		else d.activeIds = ids;
	}
	function getById(d, id) {
		for (var i = 0; i < d.outfits.length; i++) if (d.outfits[i].id === id) return d.outfits[i];
		if (d.chars) for (var cn in d.chars) {
			var co = d.chars[cn].outfits || [];
			for (var j = 0; j < co.length; j++) if (co[j].id === id) return co[j];
		}
		if (d.virtualOutfits && d.virtualOutfits[id]) return d.virtualOutfits[id];
		return null;
	}
	function isActive(d, id) {
		return getViewActiveIds(d).indexOf(id) !== -1;
	}
	//#endregion
	//#region src/utils/toast.js
	function toast$1(msg, isErr) {
		var el = document.createElement("div");
		el.textContent = msg;
		Object.assign(el.style, {
			position: "fixed",
			bottom: "80px",
			left: "50%",
			transform: "translateX(-50%)",
			background: isErr ? "#e74c3c" : "#2ecc71",
			color: "#fff",
			padding: "8px 18px",
			borderRadius: "8px",
			fontSize: "14px",
			zIndex: "2147483647",
			opacity: "0",
			transition: "opacity .3s",
			pointerEvents: "none",
			maxWidth: "80vw",
			textAlign: "center"
		});
		document.body.appendChild(el);
		requestAnimationFrame(function() {
			el.style.opacity = "1";
		});
		setTimeout(function() {
			el.style.opacity = "0";
			setTimeout(function() {
				if (el.parentNode) el.parentNode.removeChild(el);
			}, 400);
		}, 2500);
	}
	//#endregion
	//#region src/utils/helpers.js
	function genId() {
		return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
	}
	function esc$2(s) {
		return s ? String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;") : "";
	}
	/** 获取穿搭的第一张图片（主图） */
	function getFirstImage(o) {
		if (!o) return null;
		if (o.images && o.images.length > 0) return o.images[0];
		if (o.imageData) return o.imageData;
		return null;
	}
	/** 获取穿搭所有图片数组 */
	function getAllImages(o) {
		if (!o) return [];
		if (o.images && o.images.length > 0) return o.images;
		if (o.imageData) return [o.imageData];
		return [];
	}
	/** 判断穿搭是否有图片 */
	function hasImages(o) {
		if (!o) return false;
		if (o.images && o.images.length > 0) return true;
		return !!o.imageData;
	}
	//#endregion
	//#region src/inject/injection.js
	function injectText(p, text, position) {
		if (!p.messages || !Array.isArray(p.messages)) {
			if (typeof p.prompt === "string") p.prompt = text + "\n\n" + p.prompt;
			return;
		}
		if (position === "user") {
			for (var j = p.messages.length - 1; j >= 0; j--) if (p.messages[j].role === "user") {
				var c = p.messages[j].content;
				if (typeof c === "string") p.messages[j].content = c + "\n\n" + text;
				else if (Array.isArray(c)) c.push({
					type: "text",
					text: "\n\n" + text
				});
				break;
			}
		} else if (position === "context") {
			var lastUserIdx = -1;
			for (var k = p.messages.length - 1; k >= 0; k--) if (p.messages[k].role === "user") {
				lastUserIdx = k;
				break;
			}
			var sysMsg = {
				role: "system",
				content: text
			};
			if (lastUserIdx > 0) p.messages.splice(lastUserIdx, 0, sysMsg);
			else if (lastUserIdx === 0) p.messages.unshift(sysMsg);
			else p.messages.push(sysMsg);
		} else {
			var si = -1;
			for (var i = 0; i < p.messages.length; i++) if (p.messages[i].role === "system") {
				si = i;
				break;
			}
			if (si !== -1) {
				var sm = p.messages[si];
				if (typeof sm.content === "string") sm.content += "\n\n" + text;
				else if (Array.isArray(sm.content)) sm.content.push({
					type: "text",
					text: "\n\n" + text
				});
			} else p.messages.unshift({
				role: "system",
				content: text
			});
		}
	}
	function injectImageBlocks(p, ownerImageGroups, imgPrompt, multiImgPrompt) {
		if (!p.messages || !Array.isArray(p.messages)) return;
		for (var j = p.messages.length - 1; j >= 0; j--) if (p.messages[j].role === "user") {
			var c = p.messages[j].content;
			if (typeof c === "string") {
				c = [{
					type: "text",
					text: c
				}];
				p.messages[j].content = c;
			}
			if (ownerImageGroups.length > 1) c.push({
				type: "text",
				text: "\n\n=== 穿搭图片参考 ==="
			});
			var hasMulti = false;
			ownerImageGroups.forEach(function(grp) {
				if (grp.isMulti) {
					hasMulti = true;
					c.push({
						type: "text",
						text: "\n[" + grp.name + "的可选穿搭 - 共" + grp.outfits.length + "套]"
					});
					grp.outfits.forEach(function(o, i) {
						c.push({
							type: "text",
							text: "\n(" + (i + 1) + ") " + o.name + (o.sceneTag ? " [场景：" + o.sceneTag + "]" : "") + "："
						});
						getAllImages(o).forEach(function(img) {
							c.push({
								type: "image_url",
								image_url: { url: img }
							});
						});
					});
				} else {
					var o = grp.outfits[0];
					c.push({
						type: "text",
						text: "\n[" + grp.name + "当前穿着]"
					});
					getAllImages(o).forEach(function(img) {
						c.push({
							type: "image_url",
							image_url: { url: img }
						});
					});
				}
			});
			var prompt = hasMulti ? multiImgPrompt : imgPrompt;
			if (prompt) c.push({
				type: "text",
				text: "\n" + prompt
			});
			if (ownerImageGroups.length > 1) c.push({
				type: "text",
				text: "\n=== 穿搭图片结束 ==="
			});
			break;
		}
	}
	function setupInjection() {
		var origFetch = window.fetch;
		window.fetch = function(input, init) {
			try {
				if (init && init.body && typeof init.body === "string") {
					var nb = tryInjectBody(init.body);
					if (nb) {
						init = Object.assign({}, init, { body: nb });
						return origFetch.call(this, input, init);
					}
				}
			} catch (e) {}
			return origFetch.apply(this, arguments);
		};
		var origSend = XMLHttpRequest.prototype.send;
		XMLHttpRequest.prototype.send = function(body) {
			try {
				if (body && typeof body === "string") {
					var nb = tryInjectBody(body);
					if (nb) return origSend.call(this, nb);
				}
			} catch (e) {}
			return origSend.apply(this, arguments);
		};
	}
	function stripWorldBookEntries(p) {
		var re = /<[^>]*?(?:穿搭|睡衣|随机穿搭|内衣|Cosplay)[^>]*?>[\s\S]*?<\/[^>]*?(?:穿搭|睡衣|随机穿搭|内衣|Cosplay)[^>]*?>/g;
		if (p.messages && Array.isArray(p.messages)) for (var si = 0; si < p.messages.length; si++) {
			var c = p.messages[si].content;
			if (typeof c === "string") p.messages[si].content = c.replace(re, "").replace(/\n{3,}/g, "\n\n");
			else if (Array.isArray(c)) {
				for (var bi = 0; bi < c.length; bi++) if (c[bi].type === "text" && typeof c[bi].text === "string") c[bi].text = c[bi].text.replace(re, "").replace(/\n{3,}/g, "\n\n");
			}
		}
		if (typeof p.prompt === "string") p.prompt = p.prompt.replace(re, "").replace(/\n{3,}/g, "\n\n");
	}
	function tryInjectBody(bodyStr) {
		var p;
		try {
			p = JSON.parse(bodyStr);
		} catch (e) {
			return null;
		}
		if (!p || !p.messages && p.prompt === void 0) return null;
		var d = load$1();
		var pos = d.injectPosition || "user";
		var useImg = d.mode === "image" || d.mode === "both";
		var useText = d.mode === "text" || d.mode === "both";
		var owners = [];
		var userOutfits = [];
		(d.activeIds || []).forEach(function(id) {
			var found = false;
			for (var i = 0; i < d.outfits.length; i++) if (d.outfits[i].id === id) {
				userOutfits.push(d.outfits[i]);
				found = true;
				break;
			}
			if (!found && d.virtualOutfits && d.virtualOutfits[id]) {
				var vo = d.virtualOutfits[id];
				vo.id = id;
				userOutfits.push(vo);
			}
		});
		if (userOutfits.length > 0) owners.push({
			name: "User",
			outfits: userOutfits,
			tplSingle: d.singleTemplate,
			tplMulti: d.multiTemplate
		});
		if (d.chars) for (var cn in d.chars) {
			var cd = d.chars[cn];
			var cos = [];
			(cd.activeIds || []).forEach(function(id) {
				for (var k = 0; k < (cd.outfits || []).length; k++) if (cd.outfits[k].id === id) {
					cos.push(cd.outfits[k]);
					break;
				}
			});
			if (cos.length > 0) owners.push({
				name: cn,
				outfits: cos,
				tplSingle: d.charSingleTemplate,
				tplMulti: d.charMultiTemplate
			});
		}
		if (owners.length === 0) return null;
		stripWorldBookEntries(p);
		var allTextParts = [];
		var ownerImageGroups = [];
		owners.forEach(function(ow) {
			var active = ow.outfits;
			if (active.length > 1) {
				var lines = active.map(function(o, i) {
					var scene = o.sceneTag ? "【场景：" + o.sceneTag + "】" : "";
					var desc = o.description && o.description.trim() ? o.description.trim() : o.name;
					return "[" + (i + 1) + "] " + o.name + " " + scene + "\n描述：" + desc;
				});
				if (useText) {
					var wt = (ow.tplMulti || "[服装信息]\n{{charName}}的穿搭：\n{{wardrobe}}").replace(/\{\{charName\}\}/g, ow.name).replace("{{wardrobe}}", lines.join("\n\n"));
					allTextParts.push(wt);
				}
				if (useImg) {
					var imgOutfits = active.filter(function(o) {
						return hasImages(o);
					});
					if (imgOutfits.length > 0) ownerImageGroups.push({
						name: ow.name,
						outfits: imgOutfits,
						isMulti: true
					});
				}
			} else {
				var o = active[0];
				if (useText) {
					var desc2 = o.description && o.description.trim() ? o.description.trim() : o.name;
					var st = (ow.tplSingle || "[服装信息]\n{{charName}}当前穿着：\n{{description}}").replace(/\{\{charName\}\}/g, ow.name).replace("{{description}}", desc2);
					allTextParts.push(st);
				}
				if (useImg && hasImages(o)) ownerImageGroups.push({
					name: ow.name,
					outfits: [o],
					isMulti: false
				});
			}
		});
		if (allTextParts.length > 0) {
			var mergedText;
			if (allTextParts.length === 1) mergedText = allTextParts[0];
			else mergedText = "=== 当前场景服装信息（必须严格遵守，不可自行编造服装）===\n\n" + allTextParts.join("\n\n---\n\n") + "\n\n=== 服装信息结束 ===";
			injectText(p, mergedText, pos);
		}
		if (ownerImageGroups.length > 0) {
			var imgPrompt = d.imagePrompt || "";
			var multiImgPrompt = d.multiImagePrompt || "";
			injectImageBlocks(p, ownerImageGroups, imgPrompt, multiImgPrompt);
		}
		if (d.debug) toast$1(owners.map(function(ow) {
			return ow.name + ":" + ow.outfits.length + "套";
		}).join(" + ") + " [" + d.mode + "|" + pos + "]");
		return JSON.stringify(p);
	}
	//#endregion
	//#region src/utils/image.js
	function compressImage(dataUrl, cb) {
		var img = new Image();
		img.onload = function() {
			var w = img.width, h = img.height, canvas = document.createElement("canvas");
			if (w > 1200) {
				canvas.width = MAX_IMG_WIDTH;
				canvas.height = Math.round(h * MAX_IMG_WIDTH / w);
			} else {
				canvas.width = w;
				canvas.height = h;
			}
			canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
			try {
				var webpData = canvas.toDataURL("image/webp", IMG_QUALITY);
				if (webpData && webpData.indexOf("data:image/webp") === 0) {
					cb(webpData);
					return;
				}
			} catch (e) {}
			cb(canvas.toDataURL("image/jpeg", IMG_QUALITY));
		};
		img.onerror = function() {
			cb(dataUrl);
		};
		img.src = dataUrl;
	}
	//#endregion
	//#region src/ui/theme.js
	var darkMode = false;
	function getDarkMode() {
		return darkMode;
	}
	function setDarkMode(v) {
		darkMode = v;
	}
	//#endregion
	//#region src/ui/popup-layer.js
	function getPopupLayer$1() {
		var slot = document.getElementById("om-popup-slot");
		if (slot) return slot;
		var ov = document.querySelector(".om-overlay");
		if (ov) return ov;
		return document.body;
	}
	//#endregion
	//#region src/worldbook/worldbook.js
	var worldBookStyleCache$1 = {};
	var worldBookClothingPattern = /(?:名称|风格|季节|场景|描述|核心风格|生成规则)\s*[：:]/;
	var worldBookClothingPartPattern = /^\s*(?:[-*]\s*)?(上衣|内搭|下装|裙装|外搭|外套|连衣裙|旗袍|礼服|服装|配饰|鞋袜|鞋子|袜子|假发|角色|文胸|内裤|配件|文胸与内裤一体|内裤部分)\s*[：:]/m;
	function getWorldBookStyleCache() {
		return worldBookStyleCache$1;
	}
	function getWorldBookStyles(names) {
		var all = [];
		(Array.isArray(names) && names.length ? names : Object.keys(worldBookStyleCache$1)).forEach(function(k) {
			if (worldBookStyleCache$1[k]) all = all.concat(worldBookStyleCache$1[k]);
		});
		return all;
	}
	function getActiveWorldBookNames(ctx, d) {
		var names = [];
		function add(name) {
			if (name && names.indexOf(name) === -1) names.push(name);
		}
		try {
			if (ctx && ctx.chatMetadata && ctx.chatMetadata.world_info) if (Array.isArray(ctx.chatMetadata.world_info)) ctx.chatMetadata.world_info.forEach(add);
			else add(ctx.chatMetadata.world_info);
			if (typeof document !== "undefined") {
				var allNames = ctx && ctx.getWorldInfoNames ? ctx.getWorldInfoNames() : [];
				document.querySelectorAll("#world_info option:checked").forEach(function(opt) {
					add(allNames[parseInt(opt.value, 10)] || opt.textContent || opt.value);
				});
			}
			if (names.length === 0 && d && Array.isArray(d.selectedWorldBookNames)) d.selectedWorldBookNames.forEach(add);
		} catch (e) {}
		return names;
	}
	function getKnownWorldBookNames(ctx) {
		try {
			return ctx && ctx.getWorldInfoNames ? ctx.getWorldInfoNames().filter(Boolean) : [];
		} catch (e) {
			return [];
		}
	}
	function getSelectedWorldBookNames(ctx, d) {
		var selected = d && Array.isArray(d.selectedWorldBookNames) ? d.selectedWorldBookNames.filter(Boolean) : [];
		if (selected.length > 0) return selected;
		return getKnownWorldBookNames(ctx);
	}
	function createWorldBookOutfit(ws, idPrefix, idx) {
		var mw = materializeWorldBookStyle(ws);
		return {
			id: (idPrefix || "wb_dyn") + "_" + idx,
			name: mw.name,
			category: "世界书",
			type: "outfit",
			style: "",
			season: "",
			sceneTag: "",
			description: mw.desc,
			images: [],
			isVirtual: true,
			source: mw.source || ws.source || ""
		};
	}
	function getWorldBookStyleSceneKeys(ws) {
		return {
			"纯欲风": ["外出", "约会"],
			"甜酷风": ["外出", "约会"],
			"休闲风": ["外出"],
			"千禧y2k风": ["外出", "约会"],
			"运动风(街头潮牌版)": ["运动"],
			"运动风(街头潮牌版": ["运动"],
			"运动风(街头潮牌版": ["运动"],
			"日系复古风": ["外出", "约会"],
			"日系保暖": ["外出", "约会"],
			"办公室海妖风": ["外出", "约会"],
			"通勤休闲风": ["外出", "办公"],
			"学院风": ["外出"],
			"韩系日常风": [
				"外出",
				"办公",
				"约会"
			],
			"韩系女团风": ["外出", "约会"],
			"现代哥特风": ["外出", "约会"],
			"旗袍": ["外出", "约会"],
			"新中式": ["外出", "约会"],
			"御姐辣妹风": ["外出", "约会"],
			"财阀千金风": ["外出", "约会"],
			"小香风": ["外出", "约会"],
			"轻熟职场风": [
				"外出",
				"办公",
				"约会"
			],
			"多巴胺风": ["外出", "约会"],
			"欧美风": ["外出", "约会"],
			"bm风": ["外出", "约会"],
			"轻亚风": ["外出", "约会"],
			"睡衣": ["家居", "睡前"],
			"基础纯棉": ["外出", "运动"],
			"蕾丝性感": ["约会"],
			"法式三角杯": ["约会"],
			"聚拢调整": ["外出", "约会"],
			"少女可爱": ["外出", "约会"],
			"丝绸奢华": ["约会"],
			"抹胸式": ["外出", "约会"]
		}[String(ws && (ws.name || ws.style) || "").replace(/[💫🚫]/g, "").trim()] || null;
	}
	function worldBookStyleMatchesScene(ws, scene) {
		if (!scene) return true;
		var mappedScenes = getWorldBookStyleSceneKeys(ws);
		var text = [
			ws.name,
			ws.style,
			ws.scene,
			ws.desc,
			ws.raw,
			ws.source
		].join("\n");
		var titleText = [ws.name, ws.style].join("\n");
		var sceneKey = /通勤|上班|办公|职场/.test(scene) ? "办公" : scene;
		if (mappedScenes) return mappedScenes.indexOf(sceneKey) !== -1;
		if (sceneKey === "外出") return !/内衣|睡衣|睡前|家居|基础纯棉|洛丽塔|Lolita|Cos装|高定礼服|办公室/.test(text);
		if (sceneKey === "办公") return /通勤|职场|办公|上班|韩系日常/.test(text) && !/非(?:日常)?通勤|非.*办公|非.*职场/.test(text) && !/洛丽塔|Lolita|Cos装|高定礼服|旗袍|新中式|财阀|御姐|辣妹|女团|哥特|多巴胺|欧美|bm风|轻亚|纯欲|学院/.test(titleText);
		if (sceneKey === "约会" && /非.*约会|仅适用于.*(?:办公|职场|运动|睡前|家居)/.test(text)) return false;
		if (sceneKey === "家居" && /非.*家居|仅适用于.*(?:办公|职场|晚宴|漫展|茶会)/.test(text)) return false;
		if (sceneKey === "运动" && /非.*运动|仅适用于.*(?:办公|职场|晚宴|漫展|茶会)/.test(text)) return false;
		if (sceneKey === "睡前" && /非.*睡前|仅适用于.*(?:办公|职场|晚宴|漫展|茶会)/.test(text)) return false;
		var map = {
			"约会": /约会|纯欲|财阀|千金|韩系|女团|御姐|辣妹|旗袍|新中式|小香|欧美|轻熟|多巴胺|优雅|名媛/,
			"办公": /办公|职场|通勤|上班|轻熟|韩系日常|休闲/,
			"家居": /家居|睡衣|休闲|基础纯棉|内衣/,
			"运动": /运动/,
			"睡前": /睡衣|睡前|内衣|基础纯棉/
		};
		return map[sceneKey] ? map[sceneKey].test(text) : false;
	}
	function refreshWorldBookStyles(names, cb) {
		if (typeof names === "function") {
			cb = names;
			names = null;
		}
		try {
			var ctx = typeof SillyTavern !== "undefined" && SillyTavern.getContext ? SillyTavern.getContext() : null;
			names = Array.isArray(names) ? names : getActiveWorldBookNames(ctx, load());
			names = names.filter(function(name, idx) {
				return name && names.indexOf(name) === idx;
			});
			if (names.length === 0) {
				if (cb) cb();
				return;
			}
			var loaded = 0;
			if (typeof toast !== "undefined") toast("正在加载 " + names.length + " 个世界书...", false, 2e3);
			names.forEach(function(name) {
				loadWorldBookByName(ctx, name).then(function(data) {
					worldBookStyleCache$1[name] = parseWorldBookStyles(data, name);
				}).catch(function() {
					worldBookStyleCache$1[name] = worldBookStyleCache$1[name] || [];
				}).finally(function() {
					loaded++;
					if (loaded >= names.length) {
						if (typeof toast !== "undefined") toast("已加载 " + getWorldBookStyles(names).length + " 套世界书穿搭", false, 3e3);
						if (cb) cb();
					}
				});
			});
		} catch (e) {
			if (cb) cb();
		}
	}
	function loadWorldBookByName(ctx, name) {
		if (ctx && typeof ctx.loadWorldInfo === "function") return Promise.resolve(ctx.loadWorldInfo(name));
		return fetch("/api/worldinfo/get", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name })
		}).then(function(r) {
			return r.json();
		});
	}
	function getAllDisabledEntries(data, sourceName) {
		var entries = [];
		if (data && Array.isArray(data.entries)) entries = data.entries;
		else if (data && data.entries && typeof data.entries === "object") entries = Object.keys(data.entries).map(function(k) {
			return data.entries[k];
		});
		return entries.filter(function(entry) {
			if (!entry) return false;
			if (entry.enabled !== false && entry.disable !== true) return false;
			if (isWorldBookMetaEntry((entry.content || "") + "\n" + (entry.comment || "") + "\n" + (Array.isArray(entry.key) ? entry.key.join(" ") : entry.key || ""))) return false;
			return true;
		});
	}
	function enableWorldBookEntry(ctx, wbName, entryId) {
		return loadWorldBookByName(ctx, wbName).then(function(data) {
			if (!data || !data.entries) return null;
			var entries = [];
			if (Array.isArray(data.entries)) entries = data.entries;
			else if (typeof data.entries === "object") entries = Object.keys(data.entries).map(function(k) {
				return data.entries[k];
			});
			var target = null;
			for (var i = 0; i < entries.length; i++) if (entries[i] && entries[i].id === entryId) {
				target = entries[i];
				break;
			}
			if (!target) return null;
			target.enabled = true;
			if (target.disable !== void 0) delete target.disable;
			if (ctx && typeof ctx.saveWorldInfo === "function") return ctx.saveWorldInfo(wbName, data, true).then(function() {
				return target;
			});
			return fetch("/api/worldinfo/save", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: wbName,
					data
				})
			}).then(function() {
				return target;
			});
		});
	}
	function disableWorldBookEntry(ctx, wbName, entryId) {
		return loadWorldBookByName(ctx, wbName).then(function(data) {
			if (!data || !data.entries) return false;
			var entries = [];
			if (Array.isArray(data.entries)) entries = data.entries;
			else if (typeof data.entries === "object") entries = Object.keys(data.entries).map(function(k) {
				return data.entries[k];
			});
			var target = null;
			for (var i = 0; i < entries.length; i++) if (entries[i] && entries[i].id === entryId) {
				target = entries[i];
				break;
			}
			if (!target) return false;
			target.enabled = false;
			if (ctx && typeof ctx.saveWorldInfo === "function") return ctx.saveWorldInfo(wbName, data, true).then(function() {
				return true;
			});
			return fetch("/api/worldinfo/save", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: wbName,
					data
				})
			}).then(function() {
				return true;
			});
		});
	}
	function parseWorldBookStyles(data, sourceName) {
		var entries = [];
		if (data && Array.isArray(data.entries)) entries = data.entries;
		else if (data && data.entries && typeof data.entries === "object") entries = Object.keys(data.entries).map(function(k) {
			return data.entries[k];
		});
		return entries.map(function(entry) {
			if (!entry || entry.disable === true || entry.enabled === false) return null;
			var comment = entry.comment || "";
			var key = Array.isArray(entry.key) ? entry.key.join(" / ") : entry.key || "";
			var full = entry.content || comment || key || "";
			if ((full + "\n" + comment + "\n" + key).length < 8) return null;
			var haystack = full + "\n" + comment + "\n" + key;
			if (isWorldBookMetaEntry(haystack)) return null;
			if (!worldBookClothingPattern.test(haystack) && haystack.indexOf("睡衣") === -1) return null;
			if (!worldBookClothingPartPattern.test(full) && haystack.indexOf("睡衣") === -1) return null;
			return parseWorldBookEntry(full, comment, key, sourceName);
		}).filter(Boolean);
	}
	function isWorldBookMetaEntry(text) {
		var firstLine = (text || "").split("\n").filter(function(l) {
			return l.trim();
		})[0] || "";
		if (/更新必看|不要开|省tk|省token/i.test(text || "")) return true;
		if (/🚫/.test(text || "")) return true;
		if (/^<随机(?:穿搭|内衣|服饰|服装)/.test(firstLine)) return true;
		if (/^随机(?:穿搭|内衣)/.test(firstLine)) return true;
		return false;
	}
	function parseWorldBookEntry(full, comment, key, sourceName) {
		var result = {
			name: comment || key || "未命名",
			style: "",
			season: "",
			scene: "世界书",
			desc: full,
			raw: full,
			source: sourceName
		};
		function extract(label) {
			var stops = [
				"名称",
				"分类",
				"风格",
				"季节",
				"场景",
				"描述"
			].filter(function(k) {
				return k !== label;
			}).map(function(k) {
				return "(?:^|\\n)\\s*(?:[-*]\\s*)?" + k + "\\s*[：:]";
			}).join("|");
			var m = full.match(new RegExp("(?:^|\\n)\\s*(?:[-*]\\s*)?" + label + "\\s*[：:]\\s*([\\s\\S]*?)(?=" + stops + "|$)", "m"));
			return m ? m[1].trim() : "";
		}
		result.name = extract("名称") || result.name;
		result.style = extract("风格") || result.style;
		result.season = extract("季节") || result.season;
		result.scene = extract("场景") || result.scene;
		result.desc = extract("描述") || result.desc;
		if (!result.name) result.name = full.split("\n").filter(function(l) {
			return l.trim();
		})[0] || "未命名";
		if (!result.style) result.style = result.name;
		return result;
	}
	function materializeWorldBookStyle(ws) {
		var copy = {};
		for (var k in ws) copy[k] = ws[k];
		copy.desc = generateWorldBookConcreteOutfit(ws.raw || ws.desc || "", ws.name || ws.style || "世界书穿搭") || ws.desc || "";
		return copy;
	}
	function generateWorldBookConcreteOutfit(text, styleName) {
		var buckets = {};
		String(text || "").split("\n").forEach(function(line) {
			var m = line.match(/^\s*(?:[-*]\s*)?(上衣|内搭|下装|裙装|外搭|外套|连衣裙|旗袍|礼服|服装|配饰|鞋袜|鞋子|袜子|假发|角色|文胸|内裤|配件|文胸与内裤一体|内裤部分)\s*[：:]\s*(.+?)\s*$/);
			if (!m) return;
			var label = m[1], value = m[2].replace(/\s+/g, " ").trim();
			if (!value || /仅供|参考|禁止|不得|生成规则/.test(value)) return;
			if (!buckets[label]) buckets[label] = [];
			if (buckets[label].indexOf(value) === -1) buckets[label].push(value);
		});
		function pick(label) {
			var arr = buckets[label] || [];
			return arr.length ? arr[Math.floor(Math.random() * arr.length)] : "";
		}
		function pickAny(labels) {
			for (var i = 0; i < labels.length; i++) {
				var v = pick(labels[i]);
				if (v) return {
					label: labels[i],
					value: v
				};
			}
			return null;
		}
		var lines = [];
		var dress = pickAny([
			"裙装",
			"连衣裙",
			"旗袍",
			"礼服",
			"服装"
		]);
		var bra = pickAny(["文胸与内裤一体", "文胸"]);
		var panty = pickAny(["内裤", "内裤部分"]);
		if (bra || panty) {
			if (bra) lines.push(bra.label + "：" + bra.value);
			if (panty) lines.push(panty.label + "：" + panty.value);
			var lingerieExtra = pickAny([
				"配件",
				"配饰",
				"鞋袜"
			]);
			if (lingerieExtra) lines.push(lingerieExtra.label + "：" + lingerieExtra.value);
			return lines.length > 0 ? lines.join("\n") : "";
		}
		if (dress) lines.push(dress.label + "：" + dress.value);
		else {
			var top = pickAny(["上衣", "内搭"]);
			var bottom = pick("下装");
			if (top) lines.push(top.label + "：" + top.value);
			if (bottom) lines.push("下装：" + bottom);
		}
		var outer = pickAny(["外搭", "外套"]);
		var accessories = pick("配饰");
		var shoes = pickAny([
			"鞋袜",
			"鞋子",
			"袜子"
		]);
		var wig = pick("假发");
		var role = pick("角色");
		if (outer) lines.push(outer.label + "：" + outer.value);
		if (role) lines.push("角色：" + role);
		if (wig) lines.push("假发：" + wig);
		if (accessories) lines.push("配饰：" + accessories);
		if (shoes) lines.push(shoes.label + "：" + shoes.value);
		if (lines.length === 0 && /睡衣/i.test(styleName)) {
			var parts = [];
			String(text || "").split("\n").forEach(function(l) {
				var t = l.replace(/^\s*(?:[-*]\s*)(?:\d+\.\s*)?/, "").trim();
				if (t.length > 20 && !/不可以|例子|仅供参考|指导|刻画|禁止/i.test(t)) parts.push(t);
			});
			if (parts.length > 0) return parts[Math.floor(Math.random() * parts.length)];
		}
		return lines.length > 0 ? lines.join("\n") : "";
	}
	//#endregion
	//#region src/ai/auto-tag.js
	/**
	* auto-tag.js
	* Parses AI auto-tag results into structured metadata.
	*/
	function parseAutoTagResult(text) {
		var result = {
			name: "",
			type: "",
			style: "",
			season: "",
			scene: "",
			description: ""
		};
		if (!text || !text.trim()) return result;
		var parts = text.replace(/\*\*/g, "").replace(/^#+\s*/gm, "").replace(/^\s*[-*]\s*/gm, "").trim().split(/---+\n*/);
		var metaPart = parts[0] || "";
		if (parts.length > 1) result.description = parts.slice(1).join("\n").trim();
		else result.description = metaPart;
		function findKey(kp) {
			var m = metaPart.match(new RegExp(kp + "s*[：:]s*(.+?)(?:\n|$)", "im"));
			if (m) return m[1].trim();
			return "";
		}
		result.name = findKey("名称") || findKey("名字");
		if (!result.name) {
			var fl = metaPart.split("\n")[0].replace(/^[#*\-\s]+/, "").trim();
			if (fl && fl.length >= 2 && fl.length <= 30 && fl.indexOf("：") === -1 && fl.indexOf(":") === -1) result.name = fl;
		}
		var tr = findKey("类型");
		if (tr) {
			if (tr.indexOf("套装") !== -1 || tr.indexOf("搭配") !== -1 || tr.indexOf("整套") !== -1 || tr.indexOf("outfit") !== -1) result.type = "outfit";
			else if (tr.indexOf("单品") !== -1 || tr.indexOf("单件") !== -1 || tr.indexOf("item") !== -1) result.type = "item";
		}
		result.style = findKey("风格");
		result.season = findKey("季节");
		result.scene = findKey("场景");
		if (!result.name && !result.style && !result.season && !result.scene) result.description = text.trim();
		return result;
	}
	//#endregion
	//#region src/ai/presets.js
	var BUILTIN_TEMPLATES = [
		{
			id: "default",
			name: "默认（平衡风格）",
			description: "平衡细节与叙事，适合大多数场景",
			systemPrompt: "你是一位穿搭助手。根据角色性格、场景和季节，为角色设计一套合适的穿搭。输出格式：第一行为风格名称，之后为100-200字的穿搭描述。描述要具体到颜色、材质、款式细节。禁止编造图中没有的服装。",
			userPromptPrefix: "请为以下场景设计穿搭：",
			temperature: .8,
			maxTokens: 600
		},
		{
			id: "sweet",
			name: "甜美风",
			description: "少女感、柔和色调、蝴蝶结/蕾丝元素",
			systemPrompt: "你是一位擅长甜美风格的穿搭设计师。为角色设计甜美可爱的穿搭，注重柔和色调（粉色、浅蓝、奶白）、蝴蝶结、蕾丝、荷叶边等少女元素。输出格式：第一行为风格名称，之后为100-200字的甜美风穿搭描述，突出可爱感和细节。",
			userPromptPrefix: "请设计一套甜美风穿搭：",
			temperature: .9,
			maxTokens: 600
		},
		{
			id: "japanese",
			name: "日系风",
			description: "日式时尚、层次感、oversized搭配",
			systemPrompt: "你是一位精通日本时尚的穿搭设计师。为角色设计日系风格穿搭，注重层次感、宽松剪裁、oversized搭配、冷淡色调或大地色系。参考原宿风、无印良品风、日系简约等风格。输出格式：第一行为风格名称，之后为100-200字的日系穿搭描述。",
			userPromptPrefix: "请设计一套日系风穿搭：",
			temperature: .85,
			maxTokens: 600
		},
		{
			id: "formal",
			name: "正式场合",
			description: "商务正装、晚宴、优雅得体",
			systemPrompt: "你是一位精通正装礼仪的穿搭顾问。为角色设计适合正式场合的穿搭（商务会议、晚宴、颁奖典礼等），注重面料质感（羊毛、真丝、缎面）、剪裁合身、配色稳重。输出格式：第一行为场合和风格名称，之后为100-200字的正装穿搭描述。",
			userPromptPrefix: "请设计一套正式场合穿搭：",
			temperature: .7,
			maxTokens: 600
		},
		{
			id: "street",
			name: "街头风",
			description: "潮流街头、运动休闲、大胆配色",
			systemPrompt: "你是一位街头时尚达人。为角色设计潮流街头风格的穿搭，注重大胆配色、oversized轮廓、运动元素混搭、品牌球鞋、帽子配饰等。可以融合工装、运动、嘻哈等元素。输出格式：第一行为风格标签，之后为100-200字的街头风穿搭描述。",
			userPromptPrefix: "请设计一套街头风穿搭：",
			temperature: .95,
			maxTokens: 600
		},
		{
			id: "comfort",
			name: "居家舒适",
			description: "家居服、睡衣、舒适面料",
			systemPrompt: "你是一位注重舒适的穿搭设计师。为角色设计居家舒适的穿搭，注重柔软面料（棉、法兰绒、针织）、宽松版型、温暖感。适合居家、休息、睡眠场景。输出格式：第一行为风格名称，之后为100-200字的舒适穿搭描述。",
			userPromptPrefix: "请设计一套居家舒适穿搭：",
			temperature: .8,
			maxTokens: 500
		}
	];
	function importSTPreset() {
		var ctx = getSTContextSafe();
		if (!ctx) {
			toast$1("无法访问 SillyTavern 上下文", true);
			return null;
		}
		var result = {
			name: "酒馆当前预设",
			apiSettings: {},
			systemPrompt: "",
			imported: false
		};
		var mainApi = ctx.mainApi || "";
		if (mainApi === "openai") {
			var cs = ctx.chatCompletionSettings || {};
			var url = "";
			if (cs.chat_completion_source === "custom") url = cs.custom_url || "";
			else if (cs.reverse_proxy) url = cs.reverse_proxy || "";
			var model = "";
			if (ctx.getChatCompletionModel) try {
				model = ctx.getChatCompletionModel(cs) || "";
			} catch (e) {}
			if (url || model) {
				result.apiSettings = {
					endpoint: url,
					key: "",
					model,
					temperature: cs.temperature !== void 0 ? cs.temperature : null,
					maxTokens: cs.max_tokens || null,
					topP: cs.top_p !== void 0 ? cs.top_p : null,
					frequencyPenalty: cs.frequency_penalty !== void 0 ? cs.frequency_penalty : null,
					presencePenalty: cs.presence_penalty !== void 0 ? cs.presence_penalty : null
				};
				result.imported = true;
				result.apiType = "Chat Completion (" + (cs.chat_completion_source || "openai") + ")";
			}
		} else if (mainApi === "textgenerationwebui") {
			var ts = ctx.textCompletionSettings || {};
			var endpoint = "";
			if (ctx.getTextGenServer) try {
				endpoint = ctx.getTextGenServer() || "";
			} catch (e) {}
			if (endpoint) {
				result.apiSettings = {
					endpoint,
					key: "",
					model: ""
				};
				result.imported = true;
				result.apiType = "Text Completion (" + (ts.type || "unknown") + ")";
			}
		}
		try {
			if (ctx.getPresetManager) {
				var pm = ctx.getPresetManager();
				if (pm) {
					var savedConfig = pm.readPresetExtensionField({ path: "outfit_manager" });
					if (savedConfig) result.savedConfig = savedConfig;
					result.imported = true;
				}
			}
		} catch (e) {}
		return result;
	}
	function getActiveTemplate() {
		var d = load$1();
		var tplId = d.activePromptTemplate || "default";
		for (var i = 0; i < BUILTIN_TEMPLATES.length; i++) if (BUILTIN_TEMPLATES[i].id === tplId) return BUILTIN_TEMPLATES[i];
		if (d.customTemplates) {
			for (var j = 0; j < d.customTemplates.length; j++) if (d.customTemplates[j].id === tplId) return d.customTemplates[j];
		}
		return BUILTIN_TEMPLATES[0];
	}
	function setActiveTemplate(templateId) {
		var d = load$1();
		d.activePromptTemplate = templateId;
		save$1(d);
	}
	function saveCustomTemplate(name, systemPrompt, userPromptPrefix, temperature, maxTokens) {
		var d = load$1();
		if (!d.customTemplates) d.customTemplates = [];
		var tpl = {
			id: "custom_" + Date.now().toString(36),
			name,
			description: "自定义模板",
			systemPrompt: systemPrompt || "",
			userPromptPrefix: userPromptPrefix || "",
			temperature: temperature || .8,
			maxTokens: maxTokens || 600
		};
		d.customTemplates.push(tpl);
		save$1(d);
		return tpl;
	}
	function getAllTemplates() {
		var d = load$1();
		var all = BUILTIN_TEMPLATES.slice();
		if (d.customTemplates) d.customTemplates.forEach(function(t) {
			all.push(t);
		});
		return all;
	}
	function applySTPresetToApiConfig(d) {
		var stPreset = importSTPreset();
		if (!stPreset) {
			toast$1("无法访问酒馆上下文", true);
			return false;
		}
		var s = stPreset.apiSettings || {};
		if (!s.endpoint && !s.key && !s.model) {
			toast$1("未检测到酒馆 API 配置，请手动填写下方的 API 地址和 Key", true);
			return false;
		}
		if (s.endpoint) d.apiVision.endpoint = s.endpoint;
		if (s.key) d.apiVision.key = s.key;
		if (s.model) d.apiVision.model = s.model;
		d.stPresetParams = {
			temperature: s.temperature,
			maxTokens: s.maxTokens,
			topP: s.topP,
			frequencyPenalty: s.frequencyPenalty,
			presencePenalty: s.presencePenalty
		};
		toast$1("已导入酒馆 API 配置：" + (s.model || s.endpoint || "OK"));
		return true;
	}
	function saveToSTPreset(config) {
		var ctx = getSTContextSafe();
		if (!ctx || !ctx.getPresetManager) {
			toast$1("无法访问酒馆预设管理器", true);
			return false;
		}
		try {
			var pm = ctx.getPresetManager();
			if (pm && pm.writePresetExtensionField) {
				pm.writePresetExtensionField({
					path: "outfit_manager",
					value: config
				});
				toast$1("已保存到酒馆当前预设");
				return true;
			}
		} catch (e) {}
		toast$1("保存到酒馆预设失败", true);
		return false;
	}
	function importExternalPreset(file, callback) {
		var reader = new FileReader();
		reader.onload = function(e) {
			try {
				var result = parsePresetFile(JSON.parse(e.target.result));
				if (!result) {
					toast$1("无法解析预设文件", true);
					if (callback) callback(null);
					return;
				}
				var tpl = saveCustomTemplate(result.name || "导入的预设", result.systemPrompt || "", result.userPromptPrefix || "", result.temperature || .8, result.maxTokens || 600);
				setActiveTemplate(tpl.id);
				toast$1("已导入预设：" + tpl.name);
				if (callback) callback(tpl);
			} catch (err) {
				toast$1("预设文件格式错误：" + err.message, true);
				if (callback) callback(null);
			}
		};
		reader.onerror = function() {
			toast$1("读取文件失败", true);
			if (callback) callback(null);
		};
		reader.readAsText(file);
	}
	function parsePresetFile(preset) {
		if (!preset || typeof preset !== "object") return null;
		var result = {
			name: "",
			systemPrompt: "",
			userPromptPrefix: "",
			temperature: .8,
			maxTokens: 600
		};
		result.name = preset.name || preset.preset_name || preset.title || "导入的预设";
		if (preset.temperature !== void 0) result.temperature = parseFloat(preset.temperature) || .8;
		if (preset.max_tokens !== void 0) result.maxTokens = parseInt(preset.max_tokens) || 600;
		else if (preset.openai_max_tokens !== void 0) result.maxTokens = parseInt(preset.openai_max_tokens) || 600;
		if (preset.system_prompt) result.systemPrompt = preset.system_prompt;
		else if (preset.systemPrompt) result.systemPrompt = preset.systemPrompt;
		else if (preset.content && typeof preset.content === "string") result.systemPrompt = preset.content;
		if (preset.main_prompt && !result.systemPrompt) result.systemPrompt = preset.main_prompt;
		if (preset.nsfw_first && !result.systemPrompt) result.systemPrompt = preset.nsfw_first;
		if (preset.enhance_definitions_prompt) result.userPromptPrefix = preset.enhance_definitions_prompt;
		if (preset.prompt_template) {
			var tpl = preset.prompt_template;
			if (tpl.system_prompt && tpl.system_prompt.content) result.systemPrompt = tpl.system_prompt.content;
		}
		return result;
	}
	//#endregion
	//#region src/ai/generator.js
	/**
	* generator.js
	* AI outfit generation helpers and tryGenerateAIDescription.
	*/
	function _isLingerieStyle(ws) {
		return /内衣/.test(String(ws && ws.source || "")) || /内衣|文胸|内裤|抹胸|蕾丝性感|法式三角杯|聚拢|丝绸奢华|基础纯棉|少女可爱/.test(String(ws && ws.name || ""));
	}
	function _cleanStoryText(text) {
		return String(text || "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<script[\s\S]*?<\/script>/gi, "").replace(/\.[\w-]+\s*\{[\s\S]*?\}/g, "").replace(/#[\w-]+\s*\{[\s\S]*?\}/g, "").replace(/<[^>]+>/g, "").replace(/\{\{[\s\S]*?\}\}/g, "").replace(/^\s*(?:text-align|font-size|font-weight|margin|letter-spacing|white-space|opacity|display|color|background|padding|border|width|height|line-height|position)\s*:[^;\n]+;?\s*$/gim, "").replace(/\n{3,}/g, "\n\n").trim();
	}
	function _getChatContext(ctx) {
		var recent = (ctx && ctx.chat ? ctx.chat : []).slice(-15);
		var lines = [];
		for (var i = 0; i < recent.length; i++) {
			var msg = recent[i];
			var role = msg && msg.is_user ? "用户" : msg && msg.name ? msg.name : "角色";
			var text = msg && msg.mes ? _cleanStoryText(msg.mes) : "";
			if (text.length > 800) text = text.slice(0, 800) + "...";
			if (text) lines.push(role + "：" + text);
		}
		return lines.join("\n");
	}
	function _getPendingUserInput() {
		try {
			var input = document.querySelector("#send_textarea");
			return input ? _cleanStoryText(input.value) : "";
		} catch (e) {
			return "";
		}
	}
	function _cleanOutfitResult(text) {
		return String(text || "").replace(/<horae[\s\S]*?(?:<\/horae>|$)/gi, "").replace(/<content[\s\S]*?(?:<\/content>|$)/gi, "").replace(/<details[\s\S]*?(?:<\/details>|$)/gi, "").replace(/<status[\s\S]*?(?:<\/status>|$)/gi, "").replace(/\n?<\s*(?:horae?|content|details|status)[\s\S]*$/i, "").replace(/<[^>\n]+>\s*$/g, "").replace(/\n{3,}/g, "\n\n").trim();
	}
	function _getCharacterInfo(ctx) {
		try {
			var chId = ctx && ctx.this_chid;
			var chars = ctx && ctx.characters;
			if (chars && chId !== void 0 && chId !== null && chars[chId]) {
				var c = chars[chId];
				return "角色名：" + (c.name || "") + "\n角色描述：" + (c.description || "").slice(0, 200);
			}
		} catch (e) {}
		return "";
	}
	function tryGenerateAIDescription(scene, callback) {
		console.log("[OM-AI] tryGenerateAIDescription start, scene:", scene);
		var ctx = getSTContextSafe();
		var genFn = null;
		if (ctx && typeof ctx.generateRaw === "function") genFn = ctx.generateRaw;
		if (!genFn) {
			console.log("[OM-AI] generateRaw not found, fallback");
			callback(null);
			return;
		}
		console.log("[OM-AI] generateRaw OK, loading world books...");
		var d = load$1();
		var selectedWBNames = [];
		try {
			selectedWBNames = getSelectedWorldBookNames(ctx, d);
		} catch (e) {}
		console.log("[OM-AI] selectedWBNames:", selectedWBNames.length);
		var modernRefs = [];
		var lingerieRefs = [];
		if (selectedWBNames.length > 0) {
			var allStyles = getWorldBookStyles(selectedWBNames);
			modernRefs = allStyles.filter(function(ws) {
				return !_isLingerieStyle(ws) && worldBookStyleMatchesScene(ws, scene);
			});
			lingerieRefs = allStyles.filter(function(ws) {
				return _isLingerieStyle(ws) && worldBookStyleMatchesScene(ws, scene);
			});
		}
		console.log("[OM-AI] styles filtered: modern=" + modernRefs.length + ", lingerie=" + lingerieRefs.length);
		var styleGuide = "";
		if (modernRefs.length > 0) {
			styleGuide += "【外穿参考风格指导】\n";
			modernRefs.forEach(function(entry) {
				var raw = entry.raw || entry.desc || "";
				styleGuide += raw + "\n";
			});
		}
		if (lingerieRefs.length > 0) {
			styleGuide += "\n【内衣参考风格指导】\n";
			lingerieRefs.forEach(function(entry) {
				var raw = entry.raw || entry.desc || "";
				styleGuide += raw + "\n";
			});
		}
		if (!styleGuide) {
			console.log("[OM-AI] styleGuide empty, fallback");
			callback(null);
			return;
		}
		console.log("[OM-AI] styleGuide built, len=" + styleGuide.length);
		var tpl = getActiveTemplate();
		var stPreset = d.stPresetParams || null;
		var temperature = tpl.temperature || (stPreset && stPreset.temperature != null ? stPreset.temperature : .8);
		var maxTokens = tpl.maxTokens || (stPreset && stPreset.maxTokens != null ? stPreset.maxTokens : 1200);
		var sysPrompt = tpl.systemPrompt && tpl.systemPrompt.trim() ? tpl.systemPrompt : "你是穿搭助手，必须遵循以下规则：\n- 要根据正文以及前文故事情节判断此时user是否需要更换服饰。\n- 根据user的性格人设，随机生成user的穿搭服饰，需遵循各个风格的穿搭指导，并符合当前人物所处的情境，季节（冬秋季时需要在原来的基础上增衣保暖，春夏季需保持清凉），职业（避免出现在工作时穿着不当的情况）和喜好，避免ooc。发挥想象即可，穿搭风格均不限。\n- 严禁照抄例子，例子仅供穿搭参考。\n- 只输出穿搭结果，禁止输出或续写任何 <horae>、<content>、<details>、<status> 等状态标签或剧情标签。\n输出格式：第一行只输出风格名（从上述参考风格中选一个最符合的），然后换行输出具体穿搭描述，不能抄已有的例子，不要额外说明。\n输出例子：<甜酷风>\n上衣：黑色露肩印花短款T恤（露锁骨设计）\n下装：灰紫色层层蛋糕蓬蓬短裙（不规则蕾丝纱质裙摆）\n配饰：黑色猫耳发筯、骷髅元素链条choker、金属多层手链、黑色链条腋下包\n鞋袜：黑灰条纹过膝堆堆长袜、厚底黑色圆头松糕鞋";
		var charInfo = _getCharacterInfo(ctx);
		var pendingInput = _getPendingUserInput();
		var chatCtx = _getChatContext(ctx);
		var userPrompt = (tpl.userPromptPrefix && tpl.userPromptPrefix.trim() ? tpl.userPromptPrefix.trim() + "\n" : "") + "=========穿搭风格指导=========\n" + styleGuide + "\n";
		userPrompt += "=========当前正文和故事情节=========\n";
		if (pendingInput) userPrompt += "当前用户输入：\n" + pendingInput + "\n";
		if (charInfo) userPrompt += charInfo + "\n";
		if (chatCtx) userPrompt += chatCtx + "\n";
		userPrompt += "\n场景：" + scene + "\n请根据上述规则生成user的穿搭。";
		console.log("[OM-AI] ===== SYSTEM PROMPT =====");
		console.log(sysPrompt);
		console.log("[OM-AI] ===== USER PROMPT =====");
		console.log(userPrompt);
		console.log("[OM-AI] calling generateRaw, prompt len=" + (sysPrompt.length + userPrompt.length));
		var done = false;
		var tid = setTimeout(function() {
			if (!done) {
				done = true;
				console.log("[OM-AI] TIMEOUT 30s, fallback");
				callback(null);
			}
		}, 3e4);
		genFn({
			prompt: userPrompt,
			systemPrompt: sysPrompt,
			quietToLoud: false,
			responseLength: maxTokens,
			temperature
		}).then(function(result) {
			if (done) return;
			done = true;
			clearTimeout(tid);
			console.log("[OM-AI] generateRaw resolved, result len=" + (result ? result.length : 0));
			if (!result || typeof result !== "string" || result.trim().length < 5) {
				console.log("[OM-AI] result too short, fallback");
				callback(null);
				return;
			}
			var desc = _cleanOutfitResult(result);
			if (!desc || desc.length < 5) {
				console.log("[OM-AI] cleaned result too short, fallback");
				callback(null);
				return;
			}
			var outfit = {
				id: genId(),
				name: scene + "搭配",
				category: "世界书",
				type: "outfit",
				description: desc,
				style: "",
				season: "",
				sceneTag: scene,
				images: [],
				createdAt: Date.now()
			};
			console.log("[OM-AI] success, outfit desc len=" + desc.length);
			callback([outfit]);
		}).catch(function(err) {
			if (done) return;
			done = true;
			clearTimeout(tid);
			console.log("[OM-AI] generateRaw rejected:", err);
			callback(null);
		});
	}
	//#endregion
	//#region src/ai/vision.js
	function normalizeEndpoint(raw, path) {
		var url = raw.replace(/\/+$/, "");
		url = url.replace(/\/v1\/chat\/completions\/?$/, "").replace(/\/v1\/models\/?$/, "");
		url = url.replace(/\/v1\/?$/, "");
		if (path === "models") return url + "/v1/models";
		return url + "/v1/chat/completions";
	}
	function fetchModelList(apiCfg, cb) {
		if (!apiCfg.endpoint || !apiCfg.key) {
			cb("请先填写 API 地址和 Key");
			return;
		}
		var url = normalizeEndpoint(apiCfg.endpoint, "models");
		fetch(url, {
			method: "GET",
			headers: { "Authorization": "Bearer " + apiCfg.key }
		}).then(function(r) {
			if (!r.ok) return r.text().then(function(t) {
				throw new Error("HTTP " + r.status);
			});
			return r.json();
		}).then(function(data) {
			var models = [];
			var list = data.data || data.models || data;
			if (Array.isArray(list)) list.forEach(function(m) {
				var id = m.id || m.name || m;
				if (typeof id === "string" && id) models.push(id);
			});
			models.sort(function(a, b) {
				return a.toLowerCase().localeCompare(b.toLowerCase());
			});
			cb(null, models);
		}).catch(function(e) {
			cb(e.message || String(e));
		});
	}
	function openModelPicker(apiCfg, onSelect, isDark) {
		toast$1("正在拉取模型列表...");
		fetchModelList(apiCfg, function(err, models) {
			if (err) {
				toast$1("拉取失败：" + err, true);
				return;
			}
			if (!models || models.length === 0) {
				toast$1("未获取到模型列表", true);
				return;
			}
			var modal = document.createElement("div");
			modal.className = "om-modal";
			modal.style.cssText = "position:absolute !important;inset:0 !important;z-index:1 !important;background:rgba(0,0,0,.45) !important;display:flex !important;align-items:center !important;justify-content:center !important;padding:20px !important;box-sizing:border-box !important;pointer-events:auto !important;";
			var searchHtml = "<input type=\"text\" id=\"om-model-search\" placeholder=\"搜索模型...\" style=\"width:100%;background:rgba(127,127,127,.08);border:1px solid rgba(127,127,127,.2);border-radius:8px;color:inherit;padding:8px 10px;font-size:.85em;box-sizing:border-box;font-family:inherit;margin-bottom:8px\" />";
			var listHtml = models.map(function(m) {
				return "<div class=\"om-model-item\" data-model=\"" + esc$2(m) + "\" style=\"padding:10px 12px;cursor:pointer;border-radius:8px;font-size:.85em;transition:.12s;word-break:break-all\">" + esc$2(m) + "</div>";
			}).join("");
			modal.innerHTML = "<div class=\"om-modal-box\" style=\"background:" + (isDark ? "#1e1e24" : "#ececef") + ";color:" + (isDark ? "#eee" : "#111") + ";max-height:75vh\"><div class=\"om-modal-title\"><i class=\"fa-solid fa-list\" style=\"margin-right:6px\"></i>选择模型 <span style=\"font-weight:400;font-size:.75em;opacity:.5\">（共 " + models.length + " 个）</span></div>" + searchHtml + "<div id=\"om-model-list\" style=\"overflow-y:auto;max-height:50vh;display:flex;flex-direction:column;gap:2px\">" + listHtml + "</div><button class=\"om-modal-cancel\" id=\"om-model-cancel\">取消</button></div>";
			var _mp = getPopupLayer$1();
			_mp.appendChild(modal);
			modal.addEventListener("click", function(e) {
				if (e.target === modal) _mp.removeChild(modal);
			});
			modal.querySelector("#om-model-cancel").addEventListener("click", function() {
				_mp.removeChild(modal);
			});
			modal.querySelector("#om-model-search").addEventListener("input", function() {
				var q = this.value.toLowerCase();
				modal.querySelectorAll(".om-model-item").forEach(function(item) {
					item.style.display = item.dataset.model.toLowerCase().indexOf(q) !== -1 ? "" : "none";
				});
			});
			setTimeout(function() {
				modal.querySelector("#om-model-search").focus();
			}, 50);
			modal.querySelectorAll(".om-model-item").forEach(function(item) {
				item.addEventListener("mouseenter", function() {
					item.style.background = "rgba(127,127,127,.12)";
				});
				item.addEventListener("mouseleave", function() {
					item.style.background = "";
				});
				item.addEventListener("click", function() {
					_mp.removeChild(modal);
					onSelect(item.dataset.model);
					toast$1("✅ 已选择：" + item.dataset.model);
				});
			});
		});
	}
	function callVisionAPI(apiCfg, image, systemPrompt, cb, retryCount) {
		retryCount = retryCount || 0;
		var maxRetries = 4;
		if (!apiCfg.endpoint || !apiCfg.key || !apiCfg.model) {
			cb("API 未配置完整");
			return;
		}
		var endpoint = normalizeEndpoint(apiCfg.endpoint, "chat");
		var content = [{
			type: "image_url",
			image_url: { url: image.dataUrl }
		}, {
			type: "text",
			text: "请描述这套穿搭：" + image.name
		}];
		var body = {
			model: apiCfg.model,
			messages: [{
				role: "system",
				content: systemPrompt
			}, {
				role: "user",
				content
			}],
			max_tokens: 1024
		};
		try {
			fetch(endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer " + apiCfg.key
				},
				body: JSON.stringify(body)
			}).then(function(r) {
				if (!r.ok) {
					if (r.status === 429 && retryCount < maxRetries) {
						var delay = (retryCount + 1) * 5e3;
						setTimeout(function() {
							callVisionAPI(apiCfg, image, systemPrompt, cb, retryCount + 1);
						}, delay);
						return;
					}
					return r.text().then(function(t) {
						cb("HTTP " + r.status + ": " + (t || "").substring(0, 200));
					});
				}
				return r.json();
			}).then(function(data) {
				var text = "";
				if (data.choices && data.choices[0]) {
					var msg = data.choices[0].message;
					text = msg ? msg.content || "" : "";
				} else if (data.candidates && data.candidates[0]) {
					var parts = data.candidates[0].content && data.candidates[0].content.parts;
					if (parts) text = parts.map(function(p) {
						return p.text || "";
					}).join("");
				}
				cb(null, text.trim());
			}).catch(function(e) {
				cb("请求失败：" + (e.message || "网络错误"));
			});
		} catch (e) {
			cb("请求异常：" + e.message);
		}
	}
	function batchGenerateDescriptions(outfitIds, progressCb, doneCb) {
		var d = load$1();
		var apiCfg = d.apiVision;
		if (!apiCfg.endpoint || !apiCfg.key || !apiCfg.model) {
			doneCb("请先在设置中配置\"描述生成 API\"");
			return;
		}
		var targets = [];
		outfitIds.forEach(function(id) {
			var o = getById(d, id);
			if (!o || !hasImages(o)) return;
			if (!apiCfg.overwrite && o.description && o.description.trim()) return;
			targets.push(o);
		});
		if (targets.length === 0) {
			doneCb("没有需要生成描述的穿搭（可能都已有描述或无图片）");
			return;
		}
		var concurrency = Math.max(1, Math.min(5, apiCfg.concurrency || 3));
		var done = 0;
		var total = targets.length;
		var errors = [];
		var queue = targets.slice();
		function processNext() {
			if (queue.length === 0) return;
			var o = queue.shift();
			callVisionAPI(apiCfg, {
				name: o.name,
				dataUrl: getFirstImage(o)
			}, apiCfg.prompt, function(err, text) {
				done++;
				if (err) errors.push({
					name: o.name,
					error: err
				});
				else if (text) o.description = text;
				else errors.push({
					name: o.name,
					error: "返回内容为空"
				});
				progressCb(done, total, "已完成 " + done + "/" + total);
				if (done >= total) {
					save$1(d);
					doneCb(errors.length > 0 ? "完成，但有 " + errors.length + " 个错误" : null, done, errors);
				} else processNext();
			});
		}
		progressCb(0, total, "开始生成，并发数 " + concurrency + "...");
		for (var i = 0; i < Math.min(concurrency, total); i++) processNext();
	}
	function generateSingleDescription(outfit, cb) {
		var apiCfg = load$1().apiVision;
		if (!apiCfg.endpoint || !apiCfg.key || !apiCfg.model) {
			cb("请先在设置中配置\"描述生成 API\"");
			return;
		}
		if (!hasImages(outfit)) {
			cb("该穿搭没有图片");
			return;
		}
		callVisionAPI(apiCfg, {
			name: outfit.name,
			dataUrl: getFirstImage(outfit)
		}, apiCfg.prompt, function(err, text) {
			if (err) {
				cb(err);
				return;
			}
			cb(null, text);
		});
	}
	//#endregion
	//#region src/ui/sheet-utils.js
	function createSheet(contentHtml) {
		var ov = document.createElement("div");
		ov.className = "om-sheet-overlay";
		ov.innerHTML = "<div class=\"om-sheet\"><div class=\"om-sheet-handle\"></div><div class=\"om-sheet-content\">" + contentHtml + "</div></div>";
		getPopupLayer$1().appendChild(ov);
		ov.addEventListener("click", function(e) {
			if (e.target === ov) closeSheet(ov);
		});
		return ov;
	}
	function closeSheet(ov) {
		if (ov && ov.parentNode) ov.parentNode.removeChild(ov);
	}
	//#endregion
	//#region src/ui/quick-scenes.js
	var worldBookStyleCache = {};
	function renderQuickScenes(d) {
		var el = document.getElementById("om-quick-scenes");
		if (!el) return;
		el.innerHTML = "<span class=\"om-quick-title\">场景</span><div class=\"om-quick-panel\"><span style=\"font-size:.76em;opacity:.62;white-space:nowrap\">加载中</span></div>";
		var ctx = typeof SillyTavern !== "undefined" && SillyTavern.getContext ? SillyTavern.getContext() : null;
		var selectedWBNames = [];
		try {
			selectedWBNames = getSelectedWorldBookNames(ctx, d);
		} catch (err) {
			var errPanel = el.querySelector(".om-quick-panel");
			if (errPanel) errPanel.innerHTML = "<span style=\"font-size:.76em;opacity:.7;white-space:nowrap\">世界书读取失败</span>";
			console.warn("[OutfitManager] quick scenes failed to read world books", err);
			return;
		}
		if ((!d.selectedWorldBookNames || d.selectedWorldBookNames.length === 0) && selectedWBNames.length > 0) {
			d.selectedWorldBookNames = selectedWBNames.slice();
			save$1(d);
		}
		if (selectedWBNames.some(function(name) {
			return !worldBookStyleCache[name];
		}) && renderQuickScenes._loadingKey !== selectedWBNames.join("|")) {
			renderQuickScenes._loadingKey = selectedWBNames.join("|");
			refreshWorldBookStyles(selectedWBNames, function() {
				renderQuickScenes(load$1());
			});
		}
		function isLingerieStyle(ws) {
			return LINGERIE_REGEX.test(String(ws && ws.source || "")) || /内衣|文胸|内裤|抹胸|蕾丝性感|法式三角杯|聚拢|丝绸奢华|基础纯棉|少女可爱/.test(String(ws && ws.name || ""));
		}
		function modernMatches(scene) {
			return getWorldBookStyles(selectedWBNames).filter(function(ws) {
				return !isLingerieStyle(ws) && worldBookStyleMatchesScene(ws, scene);
			});
		}
		function lingerieMatches(scene) {
			if (scene === "家居" || scene === "睡前") return [];
			return getWorldBookStyles(selectedWBNames).filter(function(ws) {
				return isLingerieStyle(ws);
			});
		}
		var sceneDefs = [
			{
				key: "外出",
				label: "外出"
			},
			{
				key: "约会",
				label: "约会"
			},
			{
				key: "办公",
				label: "通勤"
			},
			{
				key: "家居",
				label: "家居"
			},
			{
				key: "运动",
				label: "运动"
			},
			{
				key: "睡前",
				label: "睡前"
			}
		];
		el.innerHTML = "<span class=\"om-quick-title\">场景</span><div class=\"om-quick-panel\">" + (sceneDefs.length === 0 ? "<span style=\"font-size:.76em;opacity:.62;white-space:nowrap\">暂无场景</span>" : sceneDefs.map(function(def) {
			return "<button class=\"om-quick-scene-btn\" data-scene=\"" + esc$1(def.key) + "\">" + esc$1(def.label) + "</button>";
		}).join("")) + "</div>";
		el.querySelectorAll(".om-quick-scene-btn").forEach(function(btn) {
			btn.addEventListener("click", function() {
				var scene = this.dataset.scene;
				var darkMode = getDarkMode();
				var modal2 = document.createElement("div");
				modal2.className = "om-modal";
				var bgg = darkMode ? "#1e1e24" : "#ececef";
				var fgg = darkMode ? "#eee" : "#111";
				modal2.innerHTML = "<div class=\"om-modal-box\" style=\"max-width:500px;background:" + bgg + ";color:" + fgg + "\"><div class=\"om-modal-title\" style=\"font-size:1.1em\"><i class=\"fa-solid fa-shirt\"></i> " + esc$1(scene) + "</div><div id=\"om-roll-progress\" style=\"padding:30px 0;text-align:center;opacity:.7\"><i class=\"fa-solid fa-spinner fa-spin\" style=\"margin-right:8px\"></i>AI 生成中...</div><div class=\"om-btn-row\" style=\"margin-top:12px;gap:10px\" id=\"om-roll-actions\"><button class=\"om-btn om-btn-outline\" id=\"om-roll-close\">关闭</button></div></div>";
				var mp2 = getPopupLayer();
				modal2.style.cssText = "position:absolute !important;inset:0 !important;z-index:2 !important;background:rgba(0,0,0,.45) !important;display:flex !important;align-items:center !important;justify-content:center !important;padding:20px !important;box-sizing:border-box !important;pointer-events:auto !important;";
				mp2.appendChild(modal2);
				modal2.querySelector("#om-roll-close").addEventListener("click", function() {
					mp2.removeChild(modal2);
				});
				modal2.addEventListener("click", function(e) {
					if (e.target === modal2) mp2.removeChild(modal2);
				});
				function showOutfits(sc, outfits) {
					var bodyHtml = outfits.length === 0 ? "<div style=\"padding:20px;text-align:center;opacity:.6\">没有可用的穿搭</div>" : outfits.map(function(o, idx) {
						return "<div style=\"margin-bottom:12px\"><div style=\"font-weight:700;margin-bottom:6px\">" + (isLingerieStyle(o) ? "内衣" : "外穿") + "：" + esc$1(o.name) + "</div><textarea class=\"om-roll-desc\" data-idx=\"" + idx + "\" style=\"width:100%;min-height:100px;background:rgba(127,127,127,.08);border:1px solid rgba(127,127,127,.3);border-radius:10px;padding:12px;font-size:.9em;line-height:1.75;color:" + fgg + ";resize:vertical;font-family:inherit\">" + (o.description || "") + "</textarea></div>";
					}).join("");
					var titleEl = modal2.querySelector(".om-modal-title");
					if (titleEl) titleEl.innerHTML = "<i class=\"fa-solid fa-shirt\"></i> " + esc$1(sc) + "搭配结果";
					var progEl = document.getElementById("om-roll-progress");
					if (progEl) progEl.outerHTML = "<div style=\"max-height:360px;overflow-y:auto;margin-top:12px\">" + bodyHtml + "</div>";
					var acts = document.getElementById("om-roll-actions");
					if (acts) {
						acts.innerHTML = "<button class=\"om-btn om-btn-safe\" id=\"om-roll-confirm\"><i class=\"fa-solid fa-check\"></i> 确认</button><button class=\"om-btn\" id=\"om-roll-wardrobe\" style=\"background:var(--SmartThemeQuoteColor,#7c6daf);color:#fff\"><i class=\"fa-solid fa-box\"></i> 保存到衣橱</button><button class=\"om-btn om-btn-outline\" id=\"om-roll-close2\">关闭</button>";
						modal2.querySelector("#om-roll-confirm").addEventListener("click", function() {
							modal2.querySelectorAll(".om-roll-desc").forEach(function(ta) {
								var i = parseInt(ta.dataset.idx);
								if (i >= 0 && i < outfits.length) outfits[i].description = ta.value;
							});
							var dd = load$1();
							dd.activeIds = [];
							if (dd.chars) for (var cn in dd.chars) dd.chars[cn].activeIds = [];
							outfits.forEach(function(p) {
								var rid = genId();
								p.id = rid;
								dd.virtualOutfits[rid] = p;
								dd.activeIds.push(rid);
							});
							save$1(dd);
							renderGrid();
							renderBottomStatus();
							updateBtn();
							toast$1("已换上 " + outfits.length + " 套（" + sc + "）");
							mp2.removeChild(modal2);
						});
						modal2.querySelector("#om-roll-wardrobe").addEventListener("click", function() {
							var dd3 = load$1();
							outfits.forEach(function(p) {
								var saved = {
									id: genId(),
									name: p.name,
									category: "世界书",
									type: "outfit",
									style: p.style || "",
									season: p.season || "",
									sceneTag: p.sceneTag || "",
									description: modal2.querySelector(".om-roll-desc[data-idx=\"" + outfits.indexOf(p) + "\"]") ? modal2.querySelector(".om-roll-desc[data-idx=\"" + outfits.indexOf(p) + "\"]").value : p.description || "",
									images: [],
									createdAt: Date.now()
								};
								dd3.outfits.push(saved);
							});
							save$1(dd3);
							renderGrid();
							updateBtn();
							mp2.removeChild(modal2);
							toast$1("已保存到衣橱");
						});
						modal2.querySelector("#om-roll-close2").addEventListener("click", function() {
							mp2.removeChild(modal2);
						});
					}
				}
				tryGenerateAIDescription(scene, function(aiOutfits) {
					var outfits = [];
					if (aiOutfits && aiOutfits.length > 0) outfits = aiOutfits;
					else {
						var modernPool = modernMatches(scene);
						var lingeriePool = lingerieMatches(scene);
						if (modernPool.length > 0) outfits.push(createWorldBookOutfit(modernPool[Math.floor(Math.random() * modernPool.length)], "wb_qs_" + scene + "_modern", 0));
						if (lingeriePool.length > 0) outfits.push(createWorldBookOutfit(lingeriePool[Math.floor(Math.random() * lingeriePool.length)], "wb_qs_" + scene + "_inner", 1));
					}
					showOutfits(scene, outfits);
				});
			});
		});
	}
	function esc$1(s) {
		var d = document.createElement("div");
		d.appendChild(document.createTextNode(s));
		return d.innerHTML;
	}
	//#endregion
	//#region src/ui/bottom-status.js
	function renderBottomStatus$1() {
		var el = document.getElementById("om-bottom-status");
		if (!el) return;
		var d = load$1();
		var allActive = [];
		(d.activeIds || []).forEach(function(id) {
			var o = getById(d, id);
			if (o) allActive.push({
				owner: "User",
				name: o.name,
				id
			});
		});
		if (d.chars) for (var cn in d.chars) {
			var cd = d.chars[cn];
			(cd.activeIds || []).forEach(function(id) {
				var o = null;
				for (var k = 0; k < (cd.outfits || []).length; k++) if (cd.outfits[k].id === id) {
					o = cd.outfits[k];
					break;
				}
				if (o) allActive.push({
					owner: cn,
					name: o.name,
					id
				});
			});
		}
		var dotClass, text;
		if (allActive.length === 0) {
			dotClass = "gray";
			text = "未选择穿搭";
		} else {
			dotClass = "green";
			var parts = [];
			var userCount = allActive.filter(function(a) {
				return a.owner === "User";
			}).length;
			if (userCount > 0) parts.push("User " + userCount + "套");
			if (d.chars) for (var cn2 in d.chars) {
				var cnt = allActive.filter(function(a) {
					return a.owner === cn2;
				}).length;
				if (cnt > 0) parts.push(cn2 + " " + cnt + "套");
			}
			text = parts.join(" · ");
			if (allActive.length > 1) dotClass = "orange";
		}
		var clearBtn = allActive.length > 0 ? "<button class=\"om-status-clear\" id=\"om-status-clearall\">全部取消</button>" : "";
		var activeName = allActive.length === 1 ? allActive[0].name : "";
		var statusDisplay = activeName ? "穿着：" + esc$2(activeName) : text;
		el.innerHTML = "<div class=\"om-status-dot " + dotClass + "\"></div><span class=\"om-status-text\" title=\"" + esc$2(activeName) + "\">" + esc$2(statusDisplay) + "</span>" + clearBtn;
		renderQuickScenes(load$1());
		var clr = el.querySelector("#om-status-clearall");
		if (clr) clr.addEventListener("click", function(e) {
			e.stopPropagation();
			var dd = load$1();
			dd.activeIds = [];
			if (dd.chars) for (var cn3 in dd.chars) dd.chars[cn3].activeIds = [];
			save(dd);
			updateBtn();
			renderBottomStatus$1();
			renderGrid();
			closeDetailPanel();
			toast("已取消全部选择");
		});
	}
	//#endregion
	//#region src/ui/fab.js
	var fabResizeHandler = null;
	function injectFab() {
		if (document.querySelector(".om-overlay")) return;
		if (document.getElementById("om-fab-main")) return;
		if (load$1().showBall === false) return;
		var container = document.createElement("div");
		container.id = FAB_ID;
		var MAIN_SIZE = 38;
		var accent = "var(--SmartThemeQuoteColor,#7c6daf)";
		function posFab() {
			var vh = window.innerHeight || document.documentElement.clientHeight;
			var vw = window.innerWidth || document.documentElement.clientWidth;
			var mainTop = vh - 80 - MAIN_SIZE;
			var mainLeft = vw - 16 - MAIN_SIZE;
			if (mainTop < 10) mainTop = 10;
			if (mainLeft < 10) mainLeft = 10;
			container.setAttribute("style", "position:fixed !important;top:" + mainTop + "px !important;left:" + mainLeft + "px !important;z-index:2147483647 !important;display:flex !important;align-items:center !important;pointer-events:none !important;margin:0 !important;padding:0 !important;");
		}
		var mainBtn = document.createElement("div");
		mainBtn.id = "om-fab-main-btn";
		mainBtn.innerHTML = "<i class=\"fa-solid fa-shirt\" style=\"pointer-events:none;font-size:1.1em;\"></i>";
		function styleMainBtn() {
			mainBtn.setAttribute("style", "width:" + MAIN_SIZE + "px !important;height:" + MAIN_SIZE + "px !important;border-radius:50% !important;background:" + accent + " !important;color:#fff !important;border:none !important;cursor:pointer !important;display:flex !important;align-items:center !important;justify-content:center !important;font-size:1.2em !important;box-shadow:0 4px 16px rgba(0,0,0,.35) !important;opacity:.9 !important;visibility:visible !important;pointer-events:auto !important;margin:0 !important;padding:0 !important;flex-shrink:0 !important;transition:transform .2s !important;position:relative !important;z-index:1 !important;");
		}
		styleMainBtn();
		container.appendChild(mainBtn);
		var _dragState = {
			sx: 0,
			sy: 0,
			ox: 0,
			oy: 0,
			moved: false
		};
		mainBtn.addEventListener("touchstart", function(e) {
			var t = e.touches[0];
			_dragState.sx = t.clientX;
			_dragState.sy = t.clientY;
			var rect = container.getBoundingClientRect();
			_dragState.ox = rect.left;
			_dragState.oy = rect.top;
			_dragState.moved = false;
		}, { passive: true });
		mainBtn.addEventListener("touchmove", function(e) {
			var t = e.touches[0];
			var dx = t.clientX - _dragState.sx, dy = t.clientY - _dragState.sy;
			if (Math.abs(dx) > 5 || Math.abs(dy) > 5) _dragState.moved = true;
			if (_dragState.moved) {
				var nx = _dragState.ox + dx, ny = _dragState.oy + dy;
				var vw = window.innerWidth, vh = window.innerHeight;
				nx = Math.max(0, Math.min(nx, vw - MAIN_SIZE));
				ny = Math.max(0, Math.min(ny, vh - MAIN_SIZE));
				container.style.setProperty("left", nx + "px", "important");
				container.style.setProperty("top", ny + "px", "important");
			}
		}, { passive: true });
		mainBtn.addEventListener("touchend", function(e) {
			if (!_dragState.moved) {
				_dragState.handled = true;
				e.preventDefault();
				setTimeout(function() {
					openPopup();
				}, 50);
			}
		});
		mainBtn.addEventListener("click", function(e) {
			if (_dragState.handled) {
				_dragState.handled = false;
				return;
			}
			if (_dragState.moved) {
				_dragState.moved = false;
				return;
			}
			openPopup();
		});
		posFab();
		if (fabResizeHandler) window.removeEventListener("resize", fabResizeHandler);
		fabResizeHandler = posFab;
		window.addEventListener("resize", fabResizeHandler);
		document.body.appendChild(container);
	}
	function closeFab() {
		var fab = document.getElementById(FAB_ID);
		if (fab && fab.parentNode) fab.parentNode.removeChild(fab);
	}
	//#endregion
	//#region src/ui/lightbox.js
	function esc(s) {
		var d = document.createElement("div");
		d.appendChild(document.createTextNode(s));
		return d.innerHTML;
	}
	function openLightbox(outfits, startId) {
		if (!outfits || outfits.length === 0) return;
		var idx = 0;
		for (var i = 0; i < outfits.length; i++) if (outfits[i].id === startId) {
			idx = i;
			break;
		}
		var imgIdx = 0;
		var lb = document.createElement("div");
		lb.id = "om-lightbox";
		lb.className = "om-lightbox";
		lb.style.cssText = "position:absolute !important;inset:0 !important;z-index:2 !important;pointer-events:auto !important;background:rgba(0,0,0,.92) !important;display:flex !important;align-items:center !important;justify-content:center !important;";
		function getImages() {
			return getAllImages(outfits[idx]);
		}
		function render() {
			var o = outfits[idx];
			var imgs = getImages();
			var totalImgs = imgs.length;
			if (imgIdx >= totalImgs) imgIdx = totalImgs - 1;
			if (imgIdx < 0) imgIdx = 0;
			var currentSrc = imgs[imgIdx] || getFirstImage(o) || "";
			var outfitPrevBtn = outfits.length > 1 ? "<button class=\"om-lb-nav om-lb-prev\" id=\"om-lb-prev\" title=\"上一套\"><i class=\"fa-solid fa-chevron-left\"></i></button>" : "";
			var outfitNextBtn = outfits.length > 1 ? "<button class=\"om-lb-nav om-lb-next\" id=\"om-lb-next\" title=\"下一套\"><i class=\"fa-solid fa-chevron-right\"></i></button>" : "";
			var imgPrevBtn = totalImgs > 1 ? "<button class=\"om-lb-img-nav om-lb-img-prev\" id=\"om-lb-img-prev\" title=\"上一张\"><i class=\"fa-solid fa-chevron-left\"></i></button>" : "";
			var imgNextBtn = totalImgs > 1 ? "<button class=\"om-lb-img-nav om-lb-img-next\" id=\"om-lb-img-next\" title=\"下一张\"><i class=\"fa-solid fa-chevron-right\"></i></button>" : "";
			var imgCounter = totalImgs > 1 ? "<div class=\"om-lb-img-counter\">" + (imgIdx + 1) + " / " + totalImgs + "</div>" : "";
			var outfitCounter = outfits.length > 1 ? "<div class=\"om-lb-counter\">" + (idx + 1) + " / " + outfits.length + "</div>" : "";
			lb.innerHTML = "<button class=\"om-lb-close\" id=\"om-lb-close\"><i class=\"fa-solid fa-xmark\"></i></button><div class=\"om-lb-name\">" + esc(o.name) + "</div>" + outfitPrevBtn + imgPrevBtn + "<img class=\"om-lb-img\" src=\"" + currentSrc + "\" draggable=\"false\" />" + imgNextBtn + outfitNextBtn + imgCounter + outfitCounter;
			lb.querySelector("#om-lb-close").addEventListener("click", closeLb);
			var prev = lb.querySelector("#om-lb-prev");
			var next = lb.querySelector("#om-lb-next");
			if (prev) prev.addEventListener("click", function(e) {
				e.stopPropagation();
				idx = (idx - 1 + outfits.length) % outfits.length;
				imgIdx = 0;
				render();
			});
			if (next) next.addEventListener("click", function(e) {
				e.stopPropagation();
				idx = (idx + 1) % outfits.length;
				imgIdx = 0;
				render();
			});
			var imgPrev = lb.querySelector("#om-lb-img-prev");
			var imgNext = lb.querySelector("#om-lb-img-next");
			if (imgPrev) imgPrev.addEventListener("click", function(e) {
				e.stopPropagation();
				imgIdx = (imgIdx - 1 + totalImgs) % totalImgs;
				render();
			});
			if (imgNext) imgNext.addEventListener("click", function(e) {
				e.stopPropagation();
				imgIdx = (imgIdx + 1) % totalImgs;
				render();
			});
		}
		lb.addEventListener("click", function(e) {
			if (e.target === lb) closeLb();
		});
		function closeLb() {
			if (lb.parentNode) lb.parentNode.removeChild(lb);
			document.removeEventListener("keydown", keyH);
		}
		function keyH(e) {
			if (e.key === "Escape") {
				closeLb();
				return;
			}
			var imgs = getImages();
			if (e.key === "ArrowLeft") {
				if (imgs.length > 1) imgIdx = (imgIdx - 1 + imgs.length) % imgs.length;
				else if (outfits.length > 1) {
					idx = (idx - 1 + outfits.length) % outfits.length;
					imgIdx = 0;
				}
				render();
			} else if (e.key === "ArrowRight") {
				if (imgs.length > 1) imgIdx = (imgIdx + 1) % imgs.length;
				else if (outfits.length > 1) {
					idx = (idx + 1) % outfits.length;
					imgIdx = 0;
				}
				render();
			}
		}
		document.addEventListener("keydown", keyH);
		render();
		getPopupLayer$1().appendChild(lb);
		lb.style.setProperty("pointer-events", "auto", "important");
	}
	//#endregion
	//#region src/ui/sheets.js
	var _exportData = function() {
		toast$1("导出功能尚未加载", true);
	};
	var _importData = function() {
		toast$1("导入功能尚未加载", true);
	};
	function getAllTagSuggestions(d) {
		var tags = [];
		d.outfits.forEach(function(o) {
			if (o.sceneTag && o.sceneTag.trim()) {
				var t = o.sceneTag.trim();
				if (tags.indexOf(t) === -1) tags.push(t);
			}
		});
		return tags;
	}
	function batchParseItems(outfitIds, prompt, progressCb, doneCb) {
		var d = load$1();
		var apiCfg = d.apiVision;
		if (!apiCfg.endpoint || !apiCfg.key || !apiCfg.model) {
			doneCb("API 未配置");
			return;
		}
		var targets = [];
		outfitIds.forEach(function(id) {
			var o = getById(d, id);
			if (!o || !getFirstImage(o)) return;
			targets.push(o);
		});
		if (targets.length === 0) {
			doneCb("没有需要解析的穿搭");
			return;
		}
		var done = 0;
		var total = targets.length;
		var errors = [];
		var queue = targets.slice();
		var CONCURRENCY = 2;
		function processNext() {
			if (queue.length === 0) return;
			var o = queue.shift();
			callVisionAPI(apiCfg, {
				name: o.name,
				dataUrl: getFirstImage(o)
			}, prompt, function(err, text) {
				done++;
				if (err) errors.push({
					name: o.name,
					error: err
				});
				else if (text) o.description = text;
				else errors.push({
					name: o.name,
					error: "返回为空"
				});
				progressCb(done, total, "已完成 " + done + "/" + total);
				if (done >= total) {
					save$1(d);
					doneCb(errors.length > 0 ? "完成，但有 " + errors.length + " 个错误" : null, done, errors);
				} else processNext();
			});
		}
		progressCb(0, total, "开始（并发" + CONCURRENCY + "）");
		for (var i = 0; i < Math.min(CONCURRENCY, total); i++) processNext();
	}
	function openBatchParseModal(ids) {
		var d = load$1();
		var isDark = getDarkMode();
		var withImg = ids.filter(function(id) {
			var o = getById(d, id);
			return o && hasImages(o);
		});
		if (withImg.length === 0) {
			toast$1("所选穿搭中没有带图片的", true);
			return;
		}
		var bg = isDark ? "#1e1e24" : "#ececef";
		var fg = isDark ? "#eee" : "#111";
		var modal = document.createElement("div");
		modal.className = "om-modal";
		modal.innerHTML = "<div class=\"om-modal-box\" style=\"background:" + bg + ";color:" + fg + "\"><div class=\"om-modal-title\">AI 批量单品解析</div><div style=\"font-size:.82em;opacity:.7;margin-bottom:8px\">共 " + withImg.length + " 套</div><div id=\"om-bp-progress\" style=\"display:none;margin:10px 0\"><div id=\"om-bp-prog-text\" style=\"font-size:.82em;margin-bottom:6px\"></div><div style=\"height:6px;background:rgba(127,127,127,.15);border-radius:3px\"><div id=\"om-bp-prog-bar\" style=\"height:100%;width:0%;background:var(--SmartThemeQuoteColor,#7c6daf);border-radius:3px;transition:width .3s\"></div></div></div><div id=\"om-bp-result\" style=\"display:none;margin:8px 0;font-size:.82em;max-height:120px;overflow-y:auto\"></div><div class=\"om-btn-row\" id=\"om-bp-actions\"><button class=\"om-btn om-btn-safe\" id=\"om-bp-start\">开始</button><button class=\"om-btn om-btn-outline\" id=\"om-bp-close\">取消</button></div></div>";
		var mp = getPopupLayer$1();
		modal.style.cssText = "position:absolute !important;inset:0 !important;z-index:1 !important;background:rgba(0,0,0,.45) !important;display:flex !important;align-items:center !important;justify-content:center !important;padding:20px !important;box-sizing:border-box !important;pointer-events:auto !important;";
		mp.appendChild(modal);
		modal.addEventListener("click", function(e) {
			if (e.target === modal && !modal.dataset.running) mp.removeChild(modal);
		});
		modal.querySelector("#om-bp-close").addEventListener("click", function() {
			if (!modal.dataset.running) mp.removeChild(modal);
		});
		modal.querySelector("#om-bp-start").addEventListener("click", function() {
			modal.dataset.running = "1";
			modal.querySelector("#om-bp-progress").style.display = "block";
			modal.querySelector("#om-bp-start").disabled = true;
			batchParseItems(ids, d.apiVision.parsePrompt || "请逐件列出单品", function(done, total, msg) {
				var pct = total > 0 ? Math.round(done / total * 100) : 0;
				modal.querySelector("#om-bp-prog-bar").style.width = pct + "%";
				modal.querySelector("#om-bp-prog-text").textContent = msg;
			}, function(err, doneCount, errors) {
				delete modal.dataset.running;
				modal.querySelector("#om-bp-prog-bar").style.width = "100%";
				var re = modal.querySelector("#om-bp-result");
				re.style.display = "block";
				var sc = (doneCount || 0) - (errors ? errors.length : 0);
				var errDetail = errors && errors.length > 0 ? "<div style=\"color:#ff8c42;margin-top:4px\">" + errors.length + " 个失败：" + errors.map(function(e) {
					return e.name + ": " + e.error;
				}).join("<br>") + "</div>" : "";
				re.innerHTML = "<div style=\"color:#4caf50;font-weight:600\">成功 " + sc + " 条</div>" + errDetail;
				modal.querySelector("#om-bp-actions").innerHTML = "<button class=\"om-btn om-btn-safe\" id=\"om-bp-done\">完成</button>";
				modal.querySelector("#om-bp-done").addEventListener("click", function() {
					mp.removeChild(modal);
					renderGrid$1();
				});
			});
		});
	}
	function batchAutoTagItems(outfitIds, prompt, progressCb, doneCb) {
		var d = load$1();
		var apiCfg = d.apiVision;
		if (!apiCfg.endpoint || !apiCfg.key || !apiCfg.model) {
			doneCb("API 未配置");
			return;
		}
		var targets = [];
		outfitIds.forEach(function(id) {
			var o = getById(d, id);
			if (!o || !getFirstImage(o)) return;
			targets.push(o);
		});
		if (targets.length === 0) {
			doneCb("没有需要识别的穿搭");
			return;
		}
		var done = 0;
		var total = targets.length;
		var errors = [];
		var queue = targets.slice();
		var ITEM_DELAY = 800;
		function processNext() {
			if (queue.length === 0) return;
			var o = queue.shift();
			callVisionAPI(apiCfg, {
				name: o.name,
				dataUrl: getFirstImage(o)
			}, prompt, function(err, text) {
				done++;
				if (err) errors.push({
					name: o.name,
					error: err
				});
				else if (text) {
					var parsed = parseAutoTagResult(text);
					if (parsed.name) o.name = parsed.name;
					if (parsed.type) o.type = parsed.type;
					if (parsed.style) o.style = parsed.style;
					if (parsed.season) o.season = parsed.season;
					if (parsed.scene) o.sceneTag = parsed.scene;
					if (parsed.description) o.description = parsed.description;
					if (!parsed.name && !parsed.style && !parsed.season && !parsed.scene) o.description = text;
				} else errors.push({
					name: o.name,
					error: "返回为空"
				});
				progressCb(done, total, "已完成 " + done + "/" + total + (errors.length > 0 ? " (" + errors.length + "失败)" : ""));
				if (done >= total) {
					save$1(d);
					doneCb(errors.length > 0 ? "完成，但有 " + errors.length + " 个错误" : null, done, errors);
				} else setTimeout(processNext, ITEM_DELAY);
			});
		}
		progressCb(0, total, "开始处理 " + total + " 套（遇限速自动重试）");
		processNext();
	}
	function openBatchAutoTagModal(ids) {
		var d = load$1();
		var isDark = getDarkMode();
		var withImg = ids.filter(function(id) {
			var o = getById(d, id);
			return o && hasImages(o);
		});
		if (withImg.length === 0) {
			toast$1("所选穿搭中没有带图片的", true);
			return;
		}
		var bg = isDark ? "#1e1e24" : "#ececef";
		var fg = isDark ? "#eee" : "#111";
		var modal = document.createElement("div");
		modal.className = "om-modal";
		modal.innerHTML = "<div class=\"om-modal-box\" style=\"background:" + bg + ";color:" + fg + "\"><div class=\"om-modal-title\">AI 批量一键识别</div><div style=\"font-size:.82em;opacity:.7;margin-bottom:8px\">共 " + withImg.length + " 套</div><div id=\"om-at-progress\" style=\"display:none;margin:10px 0\"><div id=\"om-at-prog-text\" style=\"font-size:.82em;margin-bottom:6px\"></div><div style=\"height:6px;background:rgba(127,127,127,.15);border-radius:3px\"><div id=\"om-at-prog-bar\" style=\"height:100%;width:0%;background:var(--SmartThemeQuoteColor,#7c6daf);border-radius:3px;transition:width .3s\"></div></div></div><div id=\"om-at-result\" style=\"display:none;margin:8px 0;font-size:.82em;max-height:120px;overflow-y:auto\"></div><div class=\"om-btn-row\" id=\"om-at-actions\"><button class=\"om-btn om-btn-safe\" id=\"om-at-start\">开始</button><button class=\"om-btn om-btn-outline\" id=\"om-at-close\">取消</button></div></div>";
		var mp = getPopupLayer$1();
		modal.style.cssText = "position:absolute !important;inset:0 !important;z-index:1 !important;background:rgba(0,0,0,.45) !important;display:flex !important;align-items:center !important;justify-content:center !important;padding:20px !important;box-sizing:border-box !important;pointer-events:auto !important;";
		mp.appendChild(modal);
		modal.addEventListener("click", function(e) {
			if (e.target === modal && !modal.dataset.running) mp.removeChild(modal);
		});
		modal.querySelector("#om-at-close").addEventListener("click", function() {
			if (!modal.dataset.running) mp.removeChild(modal);
		});
		modal.querySelector("#om-at-start").addEventListener("click", function() {
			modal.dataset.running = "1";
			modal.querySelector("#om-at-progress").style.display = "block";
			modal.querySelector("#om-at-start").disabled = true;
			batchAutoTagItems(ids, d.apiVision.autoTagPrompt || "请分析", function(done, total, msg) {
				var pct = total > 0 ? Math.round(done / total * 100) : 0;
				modal.querySelector("#om-at-prog-bar").style.width = pct + "%";
				modal.querySelector("#om-at-prog-text").textContent = msg;
			}, function(err, doneCount, errors) {
				delete modal.dataset.running;
				modal.querySelector("#om-at-prog-bar").style.width = "100%";
				var re = modal.querySelector("#om-at-result");
				re.style.display = "block";
				var sc = (doneCount || 0) - (errors ? errors.length : 0);
				var errDetail = errors && errors.length > 0 ? "<div style=\"color:#ff8c42;margin-top:4px\">" + errors.length + " 个失败：" + errors.map(function(e) {
					return e.name + ": " + e.error;
				}).join("<br>") + "</div>" : "";
				re.innerHTML = "<div style=\"color:#4caf50;font-weight:600\">成功 " + sc + " 条</div>" + errDetail;
				modal.querySelector("#om-at-actions").innerHTML = "<button class=\"om-btn om-btn-safe\" id=\"om-at-done\">完成</button>";
				modal.querySelector("#om-at-done").addEventListener("click", function() {
					mp.removeChild(modal);
					renderGrid$1();
				});
			});
		});
	}
	function openBatchAddSheet(defaultCat) {
		var catOpts = "<option value=\"\">无分类</option>" + getViewCategories(load$1()).map(function(c) {
			return "<option value=\"" + esc$2(c) + "\">" + esc$2(c) + "</option>";
		}).join("");
		if (defaultCat) catOpts = catOpts.replace("value=\"" + esc$2(defaultCat) + "\"", "value=\"" + esc$2(defaultCat) + "\" selected");
		var sheet = createSheet([
			"<div class=\"om-sheet-title\"><i class=\"fa-solid fa-images\"></i>批量添加穿搭</div>",
			"<div class=\"om-field\"><label>名称前缀</label><input type=\"text\" id=\"om-ba-prefix\" placeholder=\"如：睡衣 -> 睡衣 1、睡衣 2...\" /></div>",
			"<div class=\"om-field\"><label>类型</label><div class=\"om-type-radios\"><label class=\"om-radio-label\"><input type=\"radio\" name=\"om-ba-type\" value=\"outfit\" checked /> 套装</label><label class=\"om-radio-label\"><input type=\"radio\" name=\"om-ba-type\" value=\"item\" /> 单品</label></div></div>",
			"<div class=\"om-field\"><label>分类</label><div class=\"om-frow\"><select id=\"om-ba-cat\">" + catOpts + "</select><button class=\"om-btn om-btn-outline\" id=\"om-ba-newcat\" style=\"white-space:nowrap;font-size:.8em;padding:7px 10px\">+ 新建</button></div></div>",
			"<div class=\"om-field\"><label>风格</label><input type=\"text\" id=\"om-ba-style\" placeholder=\"学院 / 简约 / 运动\" />",
			"<div class=\"om-field\"><label>季节</label><input type=\"text\" id=\"om-ba-season\" placeholder=\"春 / 夏 / 秋 / 冬 / 全年\" />",
			"<div class=\"om-field\"><label>场景标签</label><input type=\"text\" id=\"om-ba-scene\" placeholder=\"家居 / 外出 / 睡觉\" />",
			"<div class=\"om-field\"><div style=\"display:flex;align-items:center;justify-content:space-between;margin-bottom:4px\"><label style=\"margin:0\">粘贴AI描述 <span class=\"om-hint\">可选：按 --- 第N套 --- 分割，与照片顺序一一对应</span></label><button class=\"om-btn om-btn-outline\" id=\"om-ba-copyprompt\" style=\"font-size:.75em;padding:4px 10px;flex-shrink:0\" title=\"复制提示词到剪贴板\"><i class=\"fa-solid fa-copy\"></i> 复制提示词</button></div><textarea id=\"om-ba-desctext\" rows=\"8\" placeholder=\"将外部AI返回的描述粘贴到这里...&#10;格式示例：&#10;--- 第1套 ---&#10;名称：粉色睡裙&#10;分类：睡衣&#10;风格：甜美&#10;季节：夏&#10;场景：睡前&#10;描述：粉色丝绸吊带睡裙...&#10;&#10;--- 第2套 ---&#10;...\" style=\"width:100%;background:rgba(127,127,127,.08);border:1px solid rgba(127,127,127,.2);border-radius:8px;color:inherit;padding:10px;font-size:.8em;resize:vertical;font-family:inherit;box-sizing:border-box\"></textarea></div>",
			"<div class=\"om-field\"><label>选择照片</label><div class=\"om-imgarea\" id=\"om-ba-dropzone\" style=\"min-height:120px;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:8px;padding:12px\"><div class=\"om-imgph\" id=\"om-ba-placeholder\"><i class=\"fa-regular fa-images\"></i><span>点击或拖拽多张照片</span></div></div><input type=\"file\" id=\"om-ba-file\" accept=\"image/*\" multiple style=\"display:none\" /></div>",
			"<div class=\"om-field\" id=\"om-ba-preview-area\" style=\"display:none\"><label>已选择 <span id=\"om-ba-count\">0</span> 张</label><div id=\"om-ba-preview\" style=\"display:flex;flex-wrap:wrap;gap:6px;max-height:120px;overflow-y:auto\"></div></div>",
			"<div class=\"om-btn-row\"><button class=\"om-btn om-btn-safe\" id=\"om-ba-create\">创建 <span id=\"om-ba-btn-count\">0</span> 套</button><button class=\"om-btn om-btn-outline\" id=\"om-ba-cancel\">取消</button></div>"
		]);
		var batchFiles = [];
		var batchDataUrls = [];
		function updatePreview() {
			var cnt = batchFiles.length;
			sheet.querySelector("#om-ba-count").textContent = cnt;
			sheet.querySelector("#om-ba-btn-count").textContent = cnt;
			sheet.querySelector("#om-ba-preview-area").style.display = cnt > 0 ? "" : "none";
			sheet.querySelector("#om-ba-placeholder").style.display = cnt > 0 ? "none" : "";
			sheet.querySelector("#om-ba-create").disabled = cnt === 0;
			sheet.querySelector("#om-ba-preview").innerHTML = batchDataUrls.map(function(url) {
				return "<img src=\"" + url + "\" style=\"width:40px;height:40px;object-fit:cover;border-radius:4px\" />";
			}).join("");
		}
		function addFiles(files) {
			for (var i = 0; i < files.length; i++) {
				var f2 = files[i];
				if (!f2 || f2.type.indexOf("image") !== 0) continue;
				batchFiles.push(f2);
			}
			var loaded = 0;
			var total = batchFiles.length;
			batchDataUrls = new Array(total);
			for (var j = 0; j < batchFiles.length; j++) (function(idx) {
				var reader = new FileReader();
				reader.onload = function(e) {
					compressImage(e.target.result, function(c) {
						batchDataUrls[idx] = c;
						loaded++;
						if (loaded >= total) updatePreview();
					});
				};
				reader.readAsDataURL(batchFiles[idx]);
			})(j);
			if (total === 0) updatePreview();
		}
		sheet.querySelector("#om-ba-dropzone").addEventListener("click", function() {
			sheet.querySelector("#om-ba-file").click();
		});
		sheet.querySelector("#om-ba-file").addEventListener("change", function() {
			if (this.files.length > 0) addFiles(this.files);
		});
		sheet.querySelector("#om-ba-dropzone").addEventListener("dragover", function(e) {
			e.preventDefault();
		});
		sheet.querySelector("#om-ba-dropzone").addEventListener("drop", function(e) {
			e.preventDefault();
			if (e.dataTransfer && e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files);
		});
		sheet.querySelector("#om-ba-create").addEventListener("click", function() {
			var prefix = sheet.querySelector("#om-ba-prefix").value.trim();
			var cat = sheet.querySelector("#om-ba-cat").value;
			var typeEl = sheet.querySelector("input[name=\"om-ba-type\"]:checked");
			var baType = typeEl ? typeEl.value : "outfit";
			var style = sheet.querySelector("#om-ba-style").value.trim();
			var season = sheet.querySelector("#om-ba-season").value.trim();
			var scene = sheet.querySelector("#om-ba-scene").value.trim();
			var descText = sheet.querySelector("#om-ba-desctext") ? sheet.querySelector("#om-ba-desctext").value.trim() : "";
			var descBlocks = [];
			if (descText) {
				descBlocks = descText.split(/---\s*第\s*\d+\s*套\s*---/i).filter(function(b) {
					return b.trim();
				});
				if (descBlocks.length === 0) descBlocks = descText.split(/\n\s*\n\s*\n/).filter(function(b) {
					return b.trim();
				});
				if (descBlocks.length === 0) descBlocks = [descText];
			}
			var dd = load$1();
			var created = 0;
			batchDataUrls.forEach(function(url, i) {
				var name = prefix ? prefix + " " + (i + 1) : "穿搭 " + (i + 1);
				var desc = "", nm = name, oc = cat, ost = style, osn = season, osc = scene, otype = baType;
				if (descBlocks[i]) {
					var block = descBlocks[i].trim();
					function findKey(kp) {
						var stopPat = [
							"名称",
							"分类",
							"类型",
							"风格",
							"季节",
							"场景",
							"描述"
						].filter(function(k) {
							return k !== kp;
						}).map(function(k) {
							return k + "\\s*[\\uff1a：]";
						}).join("|");
						var m = block.match(new RegExp(kp + "\\s*[\\uff1a：]\\s*([\\s\\S]*?)(?=" + stopPat + "|---|$)", "i"));
						return m ? m[1].trim() : "";
					}
					var pn = findKey("名称");
					if (pn) nm = pn;
					var pcat = findKey("分类");
					if (pcat) oc = pcat;
					var ptype = findKey("类型");
					if (ptype && (ptype === "套装" || ptype === "单品")) otype = ptype;
					var pst = findKey("风格");
					if (pst) ost = pst;
					var psn = findKey("季节");
					if (psn) osn = psn;
					var psc = findKey("场景");
					if (psc) osc = psc;
					var pdesc = findKey("描述");
					if (pdesc) desc = pdesc;
				}
				var vcs = getViewCategories(dd);
				if (oc && vcs.indexOf(oc) === -1) vcs.push(oc);
				var o = {
					id: genId(),
					name: nm,
					category: oc,
					type: otype,
					style: ost,
					season: osn,
					sceneTag: osc,
					description: desc,
					images: url ? [url] : [],
					createdAt: Date.now()
				};
				if (dd.currentView === "char" && dd.currentChar) getCharData(dd, dd.currentChar).outfits.push(o);
				else dd.outfits.push(o);
				created++;
			});
			save$1(dd);
			closeSheet(sheet);
			renderCatbar();
			renderGrid$1();
			renderBottomStatus$1();
			toast$1("已创建 " + created + " 套");
		});
		sheet.querySelector("#om-ba-cancel").addEventListener("click", function() {
			closeSheet(sheet);
		});
		sheet.querySelector("#om-ba-copyprompt").addEventListener("click", function(e) {
			e.stopPropagation();
			navigator.clipboard.writeText("请逐一分析以下穿搭照片，对每张照片严格按以下格式返回（不要额外解释，直接输出）：\n\n--- 第1套 ---\n名称：<5-15字简短名称>\n分类：<睡衣/制服/常服/外出服>\n风格：<学院/简约/运动/甜美/通勤/休闲/街头/优雅/舒适>\n季节：<春/夏/秋/冬/全年>\n场景：<外出/家居/办公/约会/运动/睡前>\n描述：<100-200字服装描述>\n\n--- 第2套 ---\n...").then(function() {
				toast$1("提示词已复制！粘贴到外部AI对话框即可");
			}).catch(function() {
				toast$1("复制失败，请手动复制", true);
			});
		});
		sheet.querySelector("#om-ba-newcat").addEventListener("click", function() {
			var name = prompt("新分类名称：");
			if (!name || !name.trim()) return;
			name = name.trim();
			var dd = load$1();
			var vc = getViewCategories(dd);
			if (vc.indexOf(name) === -1) {
				vc.push(name);
				save$1(dd);
				renderCatbar();
			}
			var sel = sheet.querySelector("#om-ba-cat");
			var ex = false;
			for (var i = 0; i < sel.options.length; i++) if (sel.options[i].value === name) {
				ex = true;
				break;
			}
			if (!ex) {
				var opt = document.createElement("option");
				opt.value = name;
				opt.textContent = name;
				sel.appendChild(opt);
			}
			sel.value = name;
		});
	}
	function openRandomRoll() {
		var d = load$1();
		var allOutfits = getViewOutfits(d);
		var selectedWBNames = getSelectedWorldBookNames(getSTContextSafe(), d);
		if ((!d.selectedWorldBookNames || d.selectedWorldBookNames.length === 0) && selectedWBNames.length > 0) {
			d.selectedWorldBookNames = selectedWBNames.slice();
			save$1(d);
		}
		if (allOutfits.length === 0 && selectedWBNames.length === 0) {
			toast$1("还没有任何穿搭，也没有选择世界书", true);
			return;
		}
		var styles = [];
		var seasons = [];
		var scenes = [];
		allOutfits.forEach(function(o) {
			if (o.style && o.style.trim() && styles.indexOf(o.style.trim()) === -1) styles.push(o.style.trim());
			if (o.season && o.season.trim() && seasons.indexOf(o.season.trim()) === -1) seasons.push(o.season.trim());
			if (o.sceneTag && o.sceneTag.trim() && scenes.indexOf(o.sceneTag.trim()) === -1) scenes.push(o.sceneTag.trim());
		});
		var sopts = styles.map(function(s) {
			return "<option value=\"" + esc$2(s) + "\">" + esc$2(s) + "</option>";
		}).join("");
		var seopts = seasons.map(function(s) {
			return "<option value=\"" + esc$2(s) + "\">" + esc$2(s) + "</option>";
		}).join("");
		var scopts = scenes.map(function(s) {
			return "<option value=\"" + esc$2(s) + "\">" + esc$2(s) + "</option>";
		}).join("");
		var sheet = createSheet([
			"<div class=\"om-sheet-title\"><i class=\"fa-solid fa-dice\"></i>随机搭配</div>",
			"<div class=\"om-field\"><label style=\"font-weight:600;font-size:.85em;margin-bottom:4px\">世界书风格</label>",
			"<div style=\"display:flex;flex-direction:column;gap:4px;font-size:.82em\">",
			"<div id=\"om-roll-wb-list\" style=\"display:flex;flex-direction:column;gap:4px;font-size:.82em\"><i class=\"fa-solid fa-spinner fa-spin\"></i> 加载世界书...</div>",
			"<label style=\"display:flex;align-items:center;gap:6px;cursor:pointer;margin-top:2px\"><input type=\"checkbox\" id=\"om-roll-wb-only\" /> 仅roll世界书（不含衣柜）</label>",
			"</div></div>",
			"<div class=\"om-field\"><label>风格</label><select id=\"om-roll-style\"><option value=\"\">不限</option>" + sopts + "</select></div>",
			"<div class=\"om-field\"><label>季节</label><select id=\"om-roll-season\"><option value=\"\">不限</option>" + seopts + "</select></div>",
			"<div class=\"om-field\"><label>场景</label><select id=\"om-roll-scene\"><option value=\"\">不限</option>" + scopts + "</select></div>",
			"<div class=\"om-field\"><label>搭配模式</label><select id=\"om-roll-mode\"><option value=\"mixed\">套装优先 + 单品填充</option><option value=\"outfit\">仅套装</option><option value=\"items\">仅单品随机组合</option></select></div>",
			"<div class=\"om-field\" id=\"om-roll-result-area\" style=\"display:none;margin-top:12px\"><div style=\"font-weight:600;font-size:.95em;margin-bottom:8px;color:var(--SmartThemeQuoteColor,#7c6daf)\">搭配结果</div><div id=\"om-roll-result\" style=\"background:rgba(127,127,127,.08);border-radius:10px;padding:14px;font-size:.85em;line-height:1.7;white-space:pre-wrap\"></div><div class=\"om-btn-row\" style=\"margin-top:10px\"><button class=\"om-btn om-btn-safe\" id=\"om-roll-apply\">应用这套搭配</button></div></div>",
			"<div class=\"om-btn-row\" style=\"margin-top:10px\"><button class=\"om-btn om-btn-safe\" id=\"om-roll-go\">随机搭配！</button><button class=\"om-btn om-btn-outline\" id=\"om-roll-cancel\">取消</button></div>"
		]);
		var lastResult = null;
		var worldBookStyleCache = getWorldBookStyleCache();
		(function populateWBList() {
			var container = sheet.querySelector("#om-roll-wb-list");
			if (!container) return;
			try {
				var ctx = getSTContextSafe();
				var dd = load$1();
				var selectedDefaults = getSelectedWorldBookNames(ctx, dd);
				var allWBNames = getKnownWorldBookNames(ctx);
				var wbNames = allWBNames.length > 0 ? allWBNames : selectedDefaults.slice();
				if (wbNames.length === 0) {
					container.innerHTML = "<span style=\"opacity:.5\">酒馆中还没有世界书，请先在酒馆中创建世界书。</span>";
					return;
				}
				var selected = selectedDefaults.slice();
				var h = "";
				wbNames.forEach(function(name, idx) {
					var checked = selected.indexOf(name) !== -1 ? " checked" : "";
					h += "<label style=\"display:flex;align-items:center;gap:6px;cursor:pointer\"><input type=\"checkbox\" class=\"om-roll-wb-book\" value=\"" + name.replace(/"/g, "&quot;") + "\"" + checked + " /> " + name.replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</label>";
				});
				container.innerHTML = h;
				dd.selectedWorldBookNames = selected;
				save$1(dd);
				container.querySelectorAll(".om-roll-wb-book").forEach(function(cb) {
					cb.addEventListener("change", function() {
						var dd2 = load$1();
						dd2.selectedWorldBookNames = [];
						container.querySelectorAll(".om-roll-wb-book:checked").forEach(function(c) {
							dd2.selectedWorldBookNames.push(c.value);
						});
						save$1(dd2);
					});
				});
				var needLoad = false;
				wbNames.forEach(function(n) {
					if (!worldBookStyleCache[n]) needLoad = true;
				});
				if (needLoad) refreshWorldBookStyles(wbNames, function() {
					container.querySelectorAll(".om-roll-wb-book").forEach(function(cb) {
						if (worldBookStyleCache[cb.value]) {
							var count = worldBookStyleCache[cb.value].length;
							var txt = cb.parentElement.textContent;
							if (!/\(\d/.test(txt)) cb.parentElement.appendChild(document.createTextNode(" (" + count + "套"));
						}
					});
				});
				else container.querySelectorAll(".om-roll-wb-book").forEach(function(cb) {
					if (worldBookStyleCache[cb.value]) {
						var count = worldBookStyleCache[cb.value].length;
						cb.parentElement.appendChild(document.createTextNode(" (" + count + "套)"));
					}
				});
			} catch (e) {
				container.innerHTML = "<span style=\"opacity:.5\">加载世界书失败</span>";
			}
		})();
		function doRoll() {
			var ctx = getSTContextSafe();
			var dd = load$1();
			var wbList = sheet.querySelector("#om-roll-wb-list");
			var wbChecks = wbList ? wbList.querySelectorAll("input[type=checkbox].om-roll-wb-book:checked") : [];
			var checkedWBNames = [];
			wbChecks.forEach(function(cb) {
				checkedWBNames.push(cb.value);
			});
			if (checkedWBNames.length > 0) {
				if (dd.lastAutoEnabledEntry) {
					disableWorldBookEntry(ctx, dd.lastAutoEnabledEntry.wbName, dd.lastAutoEnabledEntry.entryId).catch(function() {});
					dd.lastAutoEnabledEntry = null;
					save$1(dd);
				}
				var pickedWB = checkedWBNames[Math.floor(Math.random() * checkedWBNames.length)];
				loadWorldBookByName(ctx, pickedWB).then(function(data) {
					var disabledEntries = getAllDisabledEntries(data, pickedWB);
					if (disabledEntries.length === 0) {
						toast$1("「" + pickedWB + "」中没有关闭的条目", true);
						doRollFallback();
						return;
					}
					var pickedEntry = disabledEntries[Math.floor(Math.random() * disabledEntries.length)];
					enableWorldBookEntry(ctx, pickedWB, pickedEntry.id).then(function(enabledEntry) {
						if (!enabledEntry) {
							toast$1("启用世界书条目失败", true);
							return;
						}
						dd = load$1();
						dd.lastAutoEnabledEntry = {
							wbName: pickedWB,
							entryId: pickedEntry.id
						};
						save$1(dd);
						var entryName = pickedEntry.comment || (Array.isArray(pickedEntry.key) ? pickedEntry.key.join(", ") : pickedEntry.key || "未命名");
						var entryContent = pickedEntry.content || "（无内容）";
						var h = "<div style=\"padding:4px 0\">";
						h += "<div style=\"font-size:.85em;opacity:.6;margin-bottom:4px\">来自 <strong>" + esc$2(pickedWB) + "</strong></div>";
						h += "<div style=\"font-weight:600;font-size:1em;margin-bottom:8px\">" + esc$2(entryName) + "</div>";
						h += "<div style=\"background:rgba(127,127,127,.06);border-radius:8px;padding:12px;font-size:.85em;line-height:1.7;white-space:pre-wrap\">" + esc$2(entryContent) + "</div>";
						h += "</div>";
						lastResult = {
							outfits: [{
								id: "wb_entry_" + pickedEntry.id + "_" + Date.now(),
								name: entryName,
								category: "世界书",
								type: "outfit",
								style: "",
								season: "",
								sceneTag: "",
								description: entryContent,
								images: [],
								isVirtual: true,
								source: pickedWB
							}],
							items: []
						};
						sheet.querySelector("#om-roll-result").innerHTML = h;
						sheet.querySelector("#om-roll-result-area").style.display = "";
						toast$1("已从「" + pickedWB + "」启用穿搭：" + entryName);
					}).catch(function(e) {
						toast$1("启用世界书条目失败：" + e.message, true);
					});
				}).catch(function(e) {
					toast$1("加载世界书失败：" + e.message, true);
				});
				return;
			}
			doRollFallback();
		}
		function doRollFallback() {
			var ss = sheet.querySelector("#om-roll-style").value;
			var sn = sheet.querySelector("#om-roll-season").value;
			var sc = sheet.querySelector("#om-roll-scene").value;
			var sm = sheet.querySelector("#om-roll-mode").value;
			var pool = (sheet.querySelector("#om-roll-wb-only") ? sheet.querySelector("#om-roll-wb-only").checked : false) ? [] : allOutfits.slice();
			var wbList2 = sheet.querySelector("#om-roll-wb-list");
			if (wbList2) wbList2.querySelectorAll("input[type=checkbox].om-roll-wb-book:checked").forEach(function(cb) {
				var wbName = cb.value;
				if (worldBookStyleCache[wbName]) worldBookStyleCache[wbName].forEach(function(ws, wi) {
					pool.push(createWorldBookOutfit(ws, "wb_dyn_" + wbName.replace(/[^a-zA-Z0-9]/g, "_"), wi));
				});
			});
			var f = pool.filter(function(o) {
				if (ss && (!o.style || o.style.trim() !== ss)) return false;
				if (sn && (!o.season || o.season.trim() !== sn)) return false;
				if (sc && (!o.sceneTag || o.sceneTag.trim() !== sc)) return false;
				return true;
			});
			if (f.length === 0) {
				toast$1("没有匹配的穿搭", true);
				return;
			}
			var r = {
				outfits: [],
				items: []
			};
			var fo = f.filter(function(o) {
				return !o.type || o.type === "outfit";
			});
			var fi = f.filter(function(o) {
				return o.type === "item";
			});
			if (sm === "outfit") {
				if (fo.length === 0) {
					toast$1("没有匹配的套装", true);
					return;
				}
				r.outfits = [fo[Math.floor(Math.random() * fo.length)]];
			} else if (sm === "items") {
				var g = {};
				fi.forEach(function(it) {
					var c = it.category || "其他";
					if (!g[c]) g[c] = [];
					g[c].push(it);
				});
				for (var k in g) r.items.push(g[k][Math.floor(Math.random() * g[k].length)]);
			} else {
				if (fo.length > 0) r.outfits = [fo[Math.floor(Math.random() * fo.length)]];
				var g2 = {};
				fi.forEach(function(it) {
					var c2 = it.category || "其他";
					if (!g2[c2]) g2[c2] = [];
					g2[c2].push(it);
				});
				for (var k2 in g2) r.items.push(g2[k2][Math.floor(Math.random() * g2[k2].length)]);
			}
			lastResult = r;
			var h = "<div>";
			if (r.outfits.length > 0) {
				h += "<div style=\"font-weight:600;margin-bottom:8px\">套装</div>";
				r.outfits.forEach(function(o) {
					h += "<div style=\"display:flex;gap:10px;align-items:flex-start;margin-bottom:12px;padding:8px;background:rgba(127,127,127,.06);border-radius:8px\">";
					if (getFirstImage(o)) h += "<img src=\"" + getFirstImage(o) + "\" style=\"width:80px;height:106px;object-fit:cover;border-radius:6px;flex-shrink:0\" />";
					h += "<div style=\"min-width:0\"><div style=\"font-weight:600;margin-bottom:2px\">" + esc$2(o.name) + "</div>";
					if (o.style) h += "<div style=\"font-size:.8em;opacity:.7\">风格：" + esc$2(o.style) + "</div>";
					if (o.season) h += "<div style=\"font-size:.8em;opacity:.7\">季节：" + esc$2(o.season) + "</div>";
					if (o.sceneTag) h += "<div style=\"font-size:.8em;opacity:.7\">场景：" + esc$2(o.sceneTag) + "</div>";
					if (o.description) h += "<div style=\"font-size:.82em;opacity:.85;margin-top:6px;line-height:1.6;padding:8px;background:rgba(127,127,127,.05);border-radius:6px;white-space:pre-wrap\">" + esc$2(o.description) + "</div>";
					h += "</div></div>";
				});
			}
			if (r.items.length > 0) {
				h += "<div style=\"font-weight:600;margin:8px 0\">单品</div>";
				r.items.forEach(function(o) {
					h += "<div style=\"display:flex;gap:10px;align-items:flex-start;margin-bottom:8px;padding:6px 8px;background:rgba(127,127,127,.04);border-radius:6px\">";
					if (getFirstImage(o)) h += "<img src=\"" + getFirstImage(o) + "\" style=\"width:60px;height:80px;object-fit:cover;border-radius:4px;flex-shrink:0\" />";
					h += "<div><span style=\"font-size:.75em;opacity:.5\">" + esc$2(o.category || "其他") + "</span><br>" + esc$2(o.name) + "</div>";
					if (o.description) h += "<div style=\"font-size:.75em;opacity:.7;margin-top:2px;line-height:1.4\">" + esc$2(o.description) + "</div>";
					h += "</div></div>";
				});
			}
			h += "</div>";
			sheet.querySelector("#om-roll-result").innerHTML = h;
			sheet.querySelector("#om-roll-result-area").style.display = "";
		}
		sheet.querySelector("#om-roll-go").addEventListener("click", doRoll);
		sheet.querySelector("#om-roll-cancel").addEventListener("click", function() {
			closeSheet(sheet);
		});
		sheet.querySelector("#om-roll-apply").addEventListener("click", function() {
			if (!lastResult) return;
			var dd = load$1();
			dd.activeIds = [];
			if (dd.chars) for (var cn in dd.chars) dd.chars[cn].activeIds = [];
			var ids = [];
			lastResult.outfits.forEach(function(o) {
				if (o.isVirtual) {
					var no = {
						id: genId(),
						name: o.name,
						category: o.category || "",
						type: "outfit",
						style: o.style || "",
						season: o.season || "",
						sceneTag: o.sceneTag || "",
						description: o.description || "",
						images: [],
						createdAt: Date.now(),
						isVirtual: true
					};
					dd.virtualOutfits[no.id] = no;
					ids.push(no.id);
				} else ids.push(o.id);
			});
			lastResult.items.forEach(function(o) {
				ids.push(o.id);
			});
			if (dd.currentView === "char" && dd.currentChar) getCharData(dd, dd.currentChar).activeIds = ids;
			else dd.activeIds = ids;
			save$1(dd);
			closeSheet(sheet);
			toast$1("已应用！(" + ids.length + "件)");
			renderGrid$1();
			renderBottomStatus$1();
			updateBtn$1();
		});
	}
	function openEditSheet(outfit, defaultCat) {
		var d = load$1();
		var editImages = outfit ? outfit.images ? outfit.images.slice() : [] : [];
		var catOpts = "<option value=\"\">无分类</option>" + getViewCategories(d).map(function(c) {
			return "<option value=\"" + esc$2(c) + "\"" + (outfit && outfit.category === c ? " selected" : "") + ">" + esc$2(c) + "</option>";
		}).join("");
		var sheet = createSheet([
			"<div class=\"om-sheet-title\"><i class=\"fa-solid fa-" + (outfit ? "pen" : "plus") + "\"></i>" + (outfit ? "编辑穿搭" : "添加穿搭") + "</div>",
			"<div class=\"om-field\"><label>穿搭名称 *</label><input type=\"text\" id=\"om-dn\" placeholder=\"如：白色蕾丝连衣裙\" value=\"" + esc$2(outfit ? outfit.name : "") + "\" /></div>",
			"<div class=\"om-field\"><label>分类</label><div class=\"om-frow\"><select id=\"om-dcat\">" + catOpts + "</select><button class=\"om-btn om-btn-outline\" id=\"om-dnewcat\" style=\"white-space:nowrap;font-size:.8em;padding:7px 10px\">+ 新建</button></div></div>",
			"<div class=\"om-field\"><label>类型</label><div class=\"om-type-radios\"><label class=\"om-radio-label\"><input type=\"radio\" name=\"om-dtype\" value=\"套装\"" + (!outfit || outfit.type !== "单品" ? " checked" : "") + " /> 套装</label><label class=\"om-radio-label\" style=\"margin-left:16px\"><input type=\"radio\" name=\"om-dtype\" value=\"单品\"" + (outfit && outfit.type === "单品" ? " checked" : "") + " /> 单品</label></div></div>",
			"<div class=\"om-field\"><label>风格</label><input type=\"text\" id=\"om-dstyle\" placeholder=\"学院 / 简约 / 运动 / 甜美 / 通勤 / 休闲 / 街头 / 优雅 / 舒适\" value=\"" + esc$2(outfit ? outfit.style || "" : "") + "\" /></div>",
			"<div class=\"om-field\"><label>季节</label><input type=\"text\" id=\"om-dseason\" placeholder=\"春 / 夏 / 秋 / 冬 / 全年\" value=\"" + esc$2(outfit ? outfit.season || "" : "") + "\" /></div>",
			"<div class=\"om-field\"><label>文字描述 <span class=\"om-hint\">AI 注入用，越详细越好</span></label><textarea id=\"om-ddesc\" rows=\"4\" placeholder=\"如：白色蕾丝镂空连衣裙，领口略低，裙摆及膝……\">" + esc$2(outfit ? outfit.description || "" : "") + "</textarea><button class=\"om-btn om-btn-outline\" id=\"om-daidesc\" style=\"font-size:.78em;margin-top:5px;align-self:flex-start\"><i class=\"fa-solid fa-wand-magic-sparkles\"></i> AI 生成描述</button><button class=\"om-btn om-btn-outline\" id=\"om-dautotag\" style=\"font-size:.78em;margin-top:5px;align-self:flex-start\"><i class=\"fa-solid fa-wand-magic-sparkles\"></i> AI 一键识别</button></div>",
			"<div class=\"om-field\"><label>场景标签 <span class=\"om-hint\">多套时 AI 据此选穿搭，如：外出 / 家居 / 睡前</span></label>",
			"<div class=\"om-suggest-wrap\"><input type=\"text\" id=\"om-dscene\" placeholder=\"外出 / 家居 / 睡前 / 运动\" value=\"" + esc$2(outfit ? outfit.sceneTag || "" : "") + "\" autocomplete=\"off\" />",
			"<div class=\"om-suggest-list\" id=\"om-scene-suggest\" style=\"display:none\"></div></div></div>",
			"<div class=\"om-field\"><label>参考图片 <span class=\"om-hint\">可选，自动压缩</span></label>",
			"<div id=\"om-dimg-thumbs\" style=\"display:flex;gap:6px;overflow-x:auto;padding:4px 0;min-height:60px;align-items:center\">" + editImages.map(function(d, i) {
				return "<div class=\"om-thumb\" data-idx=\"" + i + "\" style=\"position:relative;flex-shrink:0\"><img src=\"" + d + "\" style=\"width:60px;height:60px;object-fit:cover;border-radius:6px;cursor:pointer\" /><span class=\"om-thumb-x\" data-idx=\"" + i + "\" style=\"position:absolute;top:-4px;right:-4px;width:18px;height:18px;background:#e53935;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;cursor:pointer;line-height:1;z-index:1\">&times;</span></div>";
			}).join("") + "<div id=\"om-dimg-add\" style=\"width:60px;height:60px;border:2px dashed rgba(127,127,127,.3);border-radius:6px;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;font-size:24px;color:rgba(127,127,127,.5)\"><i class=\"fa-solid fa-plus\"></i></div></div>",
			"<input type=\"file\" id=\"om-dfile\" accept=\"image/*\" multiple style=\"display:none\" />",
			"<div class=\"om-img-actions\"><button class=\"om-btn om-btn-outline\" id=\"om-dpick\" style=\"font-size:.8em\"><i class=\"fa-solid fa-image\"></i> 选择图片</button><button class=\"om-btn om-btn-outline\" id=\"om-durl\" style=\"font-size:.8em\"><i class=\"fa-solid fa-link\"></i> 粘贴URL导入</button></div></div>",
			"<div class=\"om-edit-foot\"><button class=\"om-btn om-btn-outline\" id=\"om-dcancel\">取消</button><button class=\"om-btn om-btn-safe\" id=\"om-dsave\">保存</button></div>"
		].join(""));
		if (defaultCat) {
			var sel = sheet.querySelector("#om-dcat");
			if (sel) sel.value = defaultCat;
		}
		var sceneInput = sheet.querySelector("#om-dscene");
		var suggestList = sheet.querySelector("#om-scene-suggest");
		var allTags = getAllTagSuggestions(d);
		function showSuggestions(val) {
			var v = val.trim().toLowerCase();
			var filtered = v ? allTags.filter(function(t) {
				return t.toLowerCase().indexOf(v) !== -1 && t.toLowerCase() !== v;
			}) : allTags;
			if (filtered.length === 0) {
				suggestList.style.display = "none";
				return;
			}
			suggestList.innerHTML = filtered.map(function(t) {
				return "<div class=\"om-suggest-item\" data-val=\"" + esc$2(t) + "\">" + esc$2(t) + "</div>";
			}).join("");
			suggestList.style.display = "block";
		}
		sceneInput.addEventListener("focus", function() {
			showSuggestions(this.value);
		});
		sceneInput.addEventListener("input", function() {
			showSuggestions(this.value);
		});
		sceneInput.addEventListener("blur", function() {
			setTimeout(function() {
				suggestList.style.display = "none";
			}, 150);
		});
		suggestList.addEventListener("mousedown", function(e) {
			var item = e.target.closest(".om-suggest-item");
			if (item) {
				sceneInput.value = item.dataset.val;
				suggestList.style.display = "none";
			}
		});
		var fileInp = sheet.querySelector("#om-dfile");
		var thumbsContainer = sheet.querySelector("#om-dimg-thumbs");
		function renderThumbs() {
			var h = editImages.map(function(d, i) {
				return "<div class=\"om-thumb\" data-idx=\"" + i + "\" style=\"position:relative;flex-shrink:0\"><img src=\"" + d + "\" style=\"width:60px;height:60px;object-fit:cover;border-radius:6px;cursor:pointer\" /><span class=\"om-thumb-x\" data-idx=\"" + i + "\" style=\"position:absolute;top:-4px;right:-4px;width:18px;height:18px;background:#e53935;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;cursor:pointer;line-height:1;z-index:1\">&times;</span></div>";
			}).join("");
			h += "<div id=\"om-dimg-add\" style=\"width:60px;height:60px;border:2px dashed rgba(127,127,127,.3);border-radius:6px;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;font-size:24px;color:rgba(127,127,127,.5)\"><i class=\"fa-solid fa-plus\"></i></div>";
			thumbsContainer.innerHTML = h;
			bindThumbEvents();
		}
		function bindThumbEvents() {
			thumbsContainer.querySelectorAll(".om-thumb-x").forEach(function(btn) {
				btn.addEventListener("click", function(e) {
					e.stopPropagation();
					removeImage(parseInt(btn.dataset.idx));
				});
			});
			thumbsContainer.querySelectorAll(".om-thumb img").forEach(function(img) {
				img.addEventListener("click", function(e) {
					e.stopPropagation();
					openLightbox(img.src);
				});
			});
			var addBtn = thumbsContainer.querySelector("#om-dimg-add");
			if (addBtn) addBtn.addEventListener("click", function() {
				fileInp.click();
			});
		}
		function addImage(dataUrl) {
			editImages.push(dataUrl);
			renderThumbs();
		}
		function removeImage(idx) {
			editImages.splice(idx, 1);
			renderThumbs();
		}
		function handleFiles(files) {
			for (var i = 0; i < files.length; i++) (function(f) {
				if (!f || f.type.indexOf("image") !== 0) return;
				var r = new FileReader();
				r.onload = function(e) {
					compressImage(e.target.result, function(c) {
						addImage(c);
					});
				};
				r.readAsDataURL(f);
			})(files[i]);
		}
		sheet.querySelector("#om-durl").addEventListener("click", function() {
			var url = prompt("粘贴图片URL：");
			if (!url || !url.trim()) return;
			url = url.trim();
			toast$1("正在加载图片...");
			var img = new Image();
			img.crossOrigin = "anonymous";
			img.onload = function() {
				var canvas = document.createElement("canvas");
				canvas.width = img.naturalWidth;
				canvas.height = img.naturalHeight;
				canvas.getContext("2d").drawImage(img, 0, 0);
				compressImage(canvas.toDataURL("image/jpeg", .9), function(c) {
					addImage(c);
					toast$1("图片已添加");
				});
			};
			img.onerror = function() {
				fetch(url).then(function(r) {
					return r.blob();
				}).then(function(blob) {
					var r = new FileReader();
					r.onload = function(e) {
						compressImage(e.target.result, function(c) {
							addImage(c);
							toast$1("图片已添加");
						});
					};
					r.readAsDataURL(blob);
				}).catch(function() {
					toast$1("无法加载图片（可能被CORS阻止）", true);
				});
			};
			img.src = url;
		});
		sheet.querySelector("#om-dpick").addEventListener("click", function() {
			fileInp.click();
		});
		fileInp.addEventListener("change", function() {
			if (fileInp.files.length > 0) handleFiles(fileInp.files);
			fileInp.value = "";
		});
		bindThumbEvents();
		thumbsContainer.addEventListener("dragover", function(e) {
			e.preventDefault();
			thumbsContainer.style.outline = "2px solid var(--SmartThemeQuoteColor,#7c6daf)";
		});
		thumbsContainer.addEventListener("dragleave", function() {
			thumbsContainer.style.outline = "";
		});
		thumbsContainer.addEventListener("drop", function(e) {
			e.preventDefault();
			thumbsContainer.style.outline = "";
			if (e.dataTransfer && e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
		});
		sheet.querySelector("#om-daidesc").addEventListener("click", function() {
			if (editImages.length === 0) {
				toast$1("请先上传图片", true);
				return;
			}
			var dd = load$1();
			if (!dd.apiVision.endpoint || !dd.apiVision.key || !dd.apiVision.model) {
				toast$1("请先在设置中配置\"描述生成 API\"", true);
				return;
			}
			var btn = sheet.querySelector("#om-daidesc");
			btn.disabled = true;
			btn.innerHTML = "<i class=\"fa-solid fa-spinner fa-spin\"></i> 生成中...";
			generateSingleDescription({
				name: sheet.querySelector("#om-dn").value || "穿搭",
				images: editImages.slice()
			}, function(err, desc) {
				btn.disabled = false;
				btn.innerHTML = "<i class=\"fa-solid fa-wand-magic-sparkles\"></i> AI 生成描述";
				if (err) {
					toast$1("生成失败：" + err, true);
					return;
				}
				sheet.querySelector("#om-ddesc").value = desc;
				toast$1("描述已生成");
			});
		});
		sheet.querySelector("#om-dautotag").addEventListener("click", function() {
			if (editImages.length === 0) {
				toast$1("请先上传图片", true);
				return;
			}
			var ddx = load$1();
			if (!ddx.apiVision.endpoint || !ddx.apiVision.key || !ddx.apiVision.model) {
				toast$1("请先配置 API", true);
				return;
			}
			var btnx = this;
			var existingDesc = sheet.querySelector("#om-ddesc").value.trim();
			var tagPrompt = ddx.apiVision.autoTagPrompt || "请分析";
			if (existingDesc) tagPrompt += "\n\n以下是我已有的穿搭文字描述，请结合图片和文字一起分析：\n\"" + existingDesc + "\"\n\n请根据图片和文字描述，补全以下信息（文字描述中已有的信息请优先采用）：";
			btnx.disabled = true;
			btnx.innerHTML = "<i class=\"fa-solid fa-spinner fa-spin\"></i> 识别中...";
			callVisionAPI(ddx.apiVision, {
				name: sheet.querySelector("#om-dn").value || "穿搭",
				dataUrl: editImages[0]
			}, tagPrompt, function(err, text) {
				btnx.disabled = false;
				btnx.innerHTML = "<i class=\"fa-solid fa-wand-magic-sparkles\"></i> AI 一键识别";
				if (err) {
					toast$1("识别失败：" + err, true);
					return;
				}
				var parsed = parseAutoTagResult(text);
				if (parsed.name) sheet.querySelector("#om-dn").value = parsed.name;
				if (parsed.type) sheet.querySelectorAll("input[name=\"om-dtype\"]").forEach(function(r) {
					r.checked = r.value === parsed.type;
				});
				if (parsed.style) sheet.querySelector("#om-dstyle").value = parsed.style;
				if (parsed.season) sheet.querySelector("#om-dseason").value = parsed.season;
				if (parsed.scene) sheet.querySelector("#om-dscene").value = parsed.scene;
				toast$1("识别完成，已填写名称/类型/风格/季节/场景");
			});
		});
		sheet.querySelector("#om-dnewcat").addEventListener("click", function() {
			var name = prompt("新分类名称：");
			if (!name || !name.trim()) return;
			name = name.trim();
			var dd = load$1();
			var vc = getViewCategories(dd);
			if (vc.indexOf(name) === -1) {
				vc.push(name);
				save$1(dd);
				renderCatbar();
			}
			var sel = sheet.querySelector("#om-dcat");
			var ex = false;
			for (var i = 0; i < sel.options.length; i++) if (sel.options[i].value === name) {
				ex = true;
				break;
			}
			if (!ex) {
				var opt = document.createElement("option");
				opt.value = name;
				opt.textContent = name;
				sel.appendChild(opt);
			}
			sel.value = name;
			toast$1("分类「" + name + "」已添加");
		});
		sheet.querySelector("#om-dcancel").addEventListener("click", function() {
			closeSheet(sheet);
		});
		sheet.querySelector("#om-dsave").addEventListener("click", function() {
			var name = sheet.querySelector("#om-dn").value.trim();
			if (!name) {
				toast$1("请输入穿搭名称", true);
				return;
			}
			var cat = sheet.querySelector("#om-dcat").value;
			var desc = sheet.querySelector("#om-ddesc").value.trim();
			var scene = sheet.querySelector("#om-dscene").value.trim();
			var otype = (sheet.querySelector("input[name=\"om-dtype\"]:checked") || {}).value || "套装";
			var style = sheet.querySelector("#om-dstyle") ? sheet.querySelector("#om-dstyle").value.trim() : "";
			var season = sheet.querySelector("#om-dseason") ? sheet.querySelector("#om-dseason").value.trim() : "";
			var dd = load$1();
			if (outfit) {
				var found = false;
				for (var i = 0; i < dd.outfits.length; i++) if (dd.outfits[i].id === outfit.id) {
					Object.assign(dd.outfits[i], {
						name,
						category: cat,
						type: otype,
						style,
						season,
						description: desc,
						sceneTag: scene,
						images: editImages
					});
					found = true;
					break;
				}
				if (!found && dd.chars) for (var cn in dd.chars) {
					var co = dd.chars[cn].outfits || [];
					for (var j = 0; j < co.length; j++) if (co[j].id === outfit.id) {
						Object.assign(co[j], {
							name,
							category: cat,
							type: otype,
							style,
							season,
							description: desc,
							sceneTag: scene,
							images: editImages
						});
						found = true;
						break;
					}
					if (found) break;
				}
			} else {
				var newOutfit = {
					id: genId(),
					name,
					category: cat,
					type: otype,
					style,
					season,
					description: desc,
					sceneTag: scene,
					images: editImages,
					createdAt: Date.now()
				};
				if (dd.currentView === "char" && dd.currentChar) getCharData(dd, dd.currentChar).outfits.push(newOutfit);
				else dd.outfits.push(newOutfit);
			}
			save$1(dd);
			closeSheet(sheet);
			toast$1("✨ 已保存：" + name);
			renderCatbar();
			renderGrid$1();
			renderBottomStatus$1();
			updateBtn$1();
		});
	}
	function openPresetsSheet() {
		var d = load$1();
		var activePresetId = d.activePresetId || null;
		var presetListHtml = !d.presets || d.presets.length === 0 ? "<div class=\"om-empty\"><i class=\"fa-solid fa-bookmark\"></i><span>还没有预设</span></div>" : d.presets.map(function(p, idx) {
			var isCurrent = activePresetId && p.id === activePresetId;
			return "<div class=\"om-preset-item" + (isCurrent ? " current" : "") + "\" data-idx=\"" + idx + "\"><div class=\"om-preset-name\">" + esc$2(p.name) + (isCurrent ? " <span style=\"font-size:.7em;opacity:.5;font-weight:400\">（当前）</span>" : "") + "</div><div class=\"om-preset-count\">包含 " + (p.outfits || []).length + " 套穿搭</div><button class=\"om-btn-sm om-preset-ren\" data-idx=\"" + idx + "\" title=\"重命名\"><i class=\"fa-solid fa-pen\"></i></button><button class=\"om-btn-sm om-preset-del\" data-idx=\"" + idx + "\" title=\"删除\"><i class=\"fa-solid fa-trash\"></i></button></div>";
		}).join("");
		var currentPreset = null;
		if (activePresetId && d.presets) {
			for (var pi = 0; pi < d.presets.length; pi++) if (d.presets[pi].id === activePresetId) {
				currentPreset = d.presets[pi];
				break;
			}
		}
		var saveSection = "";
		if (currentPreset) saveSection = "<div class=\"om-sec-title\">保存</div><div class=\"om-btn-row\" style=\"margin-bottom:10px\"><button class=\"om-btn om-btn-safe\" id=\"om-preset-overwrite\" style=\"flex:1\"><i class=\"fa-solid fa-floppy-disk\"></i> 保存到「" + esc$2(currentPreset.name) + "」</button></div><div class=\"om-divider\"></div><div class=\"om-sec-title\">另存为新预设</div><div class=\"om-cat-add-row\"><input type=\"text\" id=\"om-preset-name-inp\" placeholder=\"新预设名称…\" /><button class=\"om-btn om-btn-outline\" id=\"om-preset-save\">保存</button></div>";
		else saveSection = "<div class=\"om-sec-title\">保存当前状态为预设</div><div class=\"om-hint\" style=\"margin-bottom:8px\">将当前所有穿搭数据 + 分类一起打包保存</div><div class=\"om-cat-add-row\"><input type=\"text\" id=\"om-preset-name-inp\" placeholder=\"预设名称…\" /><button class=\"om-btn om-btn-safe\" id=\"om-preset-save\">保存</button></div>";
		var sheet = createSheet([
			"<div class=\"om-sheet-title\"><i class=\"fa-solid fa-bookmark\"></i>预设管理</div>",
			"<div class=\"om-sec-title\">已保存的预设 <span class=\"om-hint\">点击名称加载</span></div>",
			presetListHtml,
			"<div class=\"om-divider\"></div>",
			saveSection
		].join(""));
		var overwriteBtn = sheet.querySelector("#om-preset-overwrite");
		if (overwriteBtn) overwriteBtn.addEventListener("click", function() {
			var dd = load$1();
			for (var i = 0; i < dd.presets.length; i++) if (dd.presets[i].id === activePresetId) {
				dd.presets[i].outfits = JSON.parse(JSON.stringify(dd.outfits));
				dd.presets[i].categories = JSON.parse(JSON.stringify(dd.categories));
				dd.presets[i].activeIds = JSON.parse(JSON.stringify(dd.activeIds));
				dd.presets[i].updatedAt = Date.now();
				break;
			}
			save$1(dd);
			closeSheet(sheet);
			toast$1("✅ 已保存到「" + currentPreset.name + "」");
			openPresetsSheet();
		});
		var inp = sheet.querySelector("#om-preset-name-inp");
		sheet.querySelector("#om-preset-save").addEventListener("click", function() {
			var name = inp.value.trim();
			if (!name) {
				toast$1("请输入预设名称", true);
				return;
			}
			var dd = load$1();
			if (!Array.isArray(dd.presets)) dd.presets = [];
			var newId = genId();
			dd.presets.push({
				id: newId,
				name,
				createdAt: Date.now(),
				outfits: JSON.parse(JSON.stringify(dd.outfits)),
				categories: JSON.parse(JSON.stringify(dd.categories)),
				activeIds: JSON.parse(JSON.stringify(dd.activeIds))
			});
			save$1(dd);
			dd = load$1();
			dd.activePresetId = newId;
			save$1(dd);
			inp.value = "";
			closeSheet(sheet);
			toast$1("✨ 预设「" + name + "」已保存");
			openPresetsSheet();
		});
		inp.addEventListener("keydown", function(e) {
			if (e.key === "Enter") sheet.querySelector("#om-preset-save").click();
		});
		sheet.querySelectorAll(".om-preset-item").forEach(function(item) {
			item.addEventListener("click", function(e) {
				if (e.target.closest(".om-preset-ren") || e.target.closest(".om-preset-del")) return;
				var dd = load$1();
				var p = dd.presets[parseInt(item.dataset.idx)];
				if (!p) return;
				if (!confirm("加载预设「" + p.name + "」？这将覆盖当前所有穿搭数据。")) return;
				dd.outfits = JSON.parse(JSON.stringify(p.outfits || []));
				dd.categories = JSON.parse(JSON.stringify(p.categories || []));
				dd.activeIds = JSON.parse(JSON.stringify(p.activeIds || []));
				dd.activePresetId = p.id;
				save$1(dd);
				closeSheet(sheet);
				renderCatbar();
				renderGrid$1();
				renderBottomStatus$1();
				updateBtn$1();
				toast$1("✅ 已加载「" + p.name + "」");
			});
		});
		sheet.querySelectorAll(".om-preset-ren").forEach(function(btn) {
			btn.addEventListener("click", function(e) {
				e.stopPropagation();
				var dd = load$1();
				var p = dd.presets[parseInt(btn.dataset.idx)];
				if (!p) return;
				var nw = prompt("重命名：", p.name);
				if (!nw || !nw.trim()) return;
				p.name = nw.trim();
				save$1(dd);
				closeSheet(sheet);
				openPresetsSheet();
				toast$1("已重命名");
			});
		});
		sheet.querySelectorAll(".om-preset-del").forEach(function(btn) {
			btn.addEventListener("click", function(e) {
				e.stopPropagation();
				var dd = load$1();
				var p = dd.presets[parseInt(btn.dataset.idx)];
				if (!p) return;
				if (!confirm("删除预设「" + p.name + "」？")) return;
				if (p.id === activePresetId) dd.activePresetId = null;
				dd.presets.splice(parseInt(btn.dataset.idx), 1);
				save$1(dd);
				closeSheet(sheet);
				openPresetsSheet();
				toast$1("已删除");
			});
		});
	}
	function openSettingsSheet() {
		var d = load$1();
		var imgCount = d.outfits.filter(function(o) {
			return hasImages(o);
		}).length;
		var tplList = getAllTemplates();
		var activeTpl = getActiveTemplate();
		var tplOpts = tplList.map(function(t) {
			var isCustom = t.id.indexOf("custom_") === 0;
			return "<option value=\"" + esc$2(t.id) + "\"" + (t.id === activeTpl.id ? " selected" : "") + ">" + esc$2(t.name) + (isCustom ? " (自定义)" : "") + "</option>";
		}).join("");
		var sheet = createSheet([
			"<div class=\"om-sheet-title\"><i class=\"fa-solid fa-sliders\"></i>设置</div>",
			"<div class=\"om-sec-title\">发送内容</div>",
			"<div class=\"om-setting-row\"><label>发送给 AI 的内容类型</label><select id=\"om-mode\">",
			"<option value=\"text\"" + (d.mode === "text" ? " selected" : "") + ">仅文字描述</option>",
			"<option value=\"image\"" + (d.mode === "image" ? " selected" : "") + ">仅图片</option>",
			"<option value=\"both\"" + (d.mode === "both" ? " selected" : "") + ">文字 + 图片</option>",
			"</select></div>",
			"<div class=\"om-setting-row\"><label style=\"display:flex;align-items:center;gap:8px;cursor:pointer\"><input type=\"checkbox\" id=\"om-auto-roll\"" + (!d.autoRollDisabled ? " checked" : "") + " /> 启动时自动随机穿搭（从世界书）</label></div><div class=\"om-setting-row\"><label>注入位置 <span class=\"om-hint\">Gemini/DeepSeek 建议选\"用户消息\"</span></label><select id=\"om-inject-pos\">",
			"<option value=\"system\"" + (d.injectPosition === "system" ? " selected" : "") + ">系统提示末尾</option>",
			"<option value=\"context\"" + (d.injectPosition === "context" ? " selected" : "") + ">上下文末尾</option>",
			"<option value=\"user\"" + (d.injectPosition === "user" || !d.injectPosition ? " selected" : "") + ">用户消息末尾（推荐）</option>",
			"</select></div>",
			"<div class=\"om-divider\"></div>",
			"<div class=\"om-sec-title\"><i class=\"fa-solid fa-wand-magic-sparkles\" style=\"margin-right:4px\"></i>提示词预设</div>",
			"<div class=\"om-setting-row\"><label>当前模板</label><select id=\"om-preset-tpl-sel\">" + tplOpts + "</select></div>",
			"<div class=\"om-setting-row\" style=\"display:flex;gap:6px;flex-wrap:wrap\">",
			"<button class=\"om-btn om-btn-outline\" id=\"om-preset-import-st\" style=\"font-size:.8em\"><i class=\"fa-solid fa-download\"></i> 导入酒馆预设</button>",
			"<button class=\"om-btn om-btn-outline\" id=\"om-preset-save-st\" style=\"font-size:.8em\"><i class=\"fa-solid fa-upload\"></i> 保存到酒馆预设</button>",
			"<button class=\"om-btn om-btn-outline\" id=\"om-preset-import-ext\" style=\"font-size:.8em\"><i class=\"fa-solid fa-file-import\"></i> 导入外部预设</button>",
			"<button class=\"om-btn om-btn-outline\" id=\"om-preset-new-tpl\" style=\"font-size:.8em\"><i class=\"fa-solid fa-plus\"></i> 新建自定义模板</button>",
			"<input type=\"file\" id=\"om-preset-ext-file\" accept=\".json\" style=\"display:none\" />",
			"</div>",
			"<div id=\"om-preset-custom-form\" style=\"display:none;margin:8px 0;padding:12px;background:rgba(127,127,127,.08);border-radius:10px\">",
			"<div style=\"font-weight:600;font-size:.9em;margin-bottom:8px\">新建自定义模板</div>",
			"<div class=\"om-setting-row\"><label>模板名称</label><input type=\"text\" id=\"om-ctpl-name\" placeholder=\"如：我的甜美风\" /></div>",
			"<div class=\"om-setting-row\"><label>系统提示词</label><textarea id=\"om-ctpl-sys\" rows=\"4\" placeholder=\"定义AI角色和输出格式...\"></textarea></div>",
			"<div class=\"om-setting-row\"><label>用户提示前缀</label><textarea id=\"om-ctpl-user\" rows=\"2\" placeholder=\"如：请为以下场景设计穿搭：\"></textarea></div>",
			"<div class=\"om-setting-row\"><label>Temperature: <span id=\"om-ctpl-temp-val\">0.8</span></label><input type=\"range\" id=\"om-ctpl-temp\" min=\"0\" max=\"2\" step=\"0.05\" value=\"0.8\" style=\"width:100%\" /></div>",
			"<div class=\"om-setting-row\"><label>Max Tokens</label><input type=\"number\" id=\"om-ctpl-tokens\" value=\"600\" min=\"50\" max=\"4000\" style=\"background:rgba(127,127,127,.08);border:1px solid rgba(127,127,127,.2);border-radius:8px;color:inherit;padding:7px 10px;font-size:.85em;width:100px;box-sizing:border-box;font-family:inherit\" /></div>",
			"<div class=\"om-btn-row\" style=\"margin-top:6px\"><button class=\"om-btn om-btn-safe\" id=\"om-ctpl-save\">保存模板</button><button class=\"om-btn om-btn-outline\" id=\"om-ctpl-cancel\">取消</button></div>",
			"</div>",
			"<div id=\"om-preset-edit-area\" style=\"display:none;margin:8px 0;padding:12px;background:rgba(127,127,127,.08);border-radius:10px\">",
			"<div style=\"font-weight:600;font-size:.9em;margin-bottom:8px\"><span id=\"om-ptpl-edit-title\"></span></div>",
			"<div class=\"om-setting-row\"><label>系统提示词</label><textarea id=\"om-ptpl-sys\" rows=\"4\"></textarea></div>",
			"<div class=\"om-setting-row\"><label>用户提示前缀</label><textarea id=\"om-ptpl-user\" rows=\"2\"></textarea></div>",
			"<div class=\"om-setting-row\"><label>Temperature: <span id=\"om-ptpl-temp-val\"></span></label><input type=\"range\" id=\"om-ptpl-temp\" min=\"0\" max=\"2\" step=\"0.05\" style=\"width:100%\" /></div>",
			"<div class=\"om-setting-row\"><label>Max Tokens</label><input type=\"number\" id=\"om-ptpl-tokens\" min=\"50\" max=\"4000\" style=\"background:rgba(127,127,127,.08);border:1px solid rgba(127,127,127,.2);border-radius:8px;color:inherit;padding:7px 10px;font-size:.85em;width:100px;box-sizing:border-box;font-family:inherit\" /></div>",
			"<div class=\"om-btn-row\" style=\"margin-top:6px\"><button class=\"om-btn om-btn-safe\" id=\"om-ptpl-save\">保存修改</button><button class=\"om-btn om-btn-outline\" id=\"om-ptpl-cancel\">取消</button></div>",
			"</div>",
			"<div class=\"om-divider\"></div>",
			"<div class=\"om-sec-title\">单套模式模板 <span class=\"om-hint\">（User选了1套时生效）</span></div>",
			"<div class=\"om-hint\" style=\"margin-bottom:6px\">{{description}} → 替换为穿搭的文字描述</div>",
			"<div class=\"om-setting-row\"><textarea id=\"om-tpl-single\" rows=\"3\">" + esc$2(d.singleTemplate) + "</textarea></div>",
			"<div class=\"om-divider\"></div>",
			"<div class=\"om-sec-title\">衣柜模式模板 <span class=\"om-hint\">（User选了多套时生效）</span></div>",
			"<div class=\"om-hint\" style=\"margin-bottom:6px\">{{wardrobe}} → 替换为所有已选穿搭的列表</div>",
			"<div class=\"om-setting-row\"><textarea id=\"om-tpl-multi\" rows=\"5\">" + esc$2(d.multiTemplate) + "</textarea></div>",
			"<div class=\"om-divider\"></div>",
			"<div class=\"om-sec-title\">角色单套模板 <span class=\"om-hint\">（角色选了1套时生效）</span></div>",
			"<div class=\"om-hint\" style=\"margin-bottom:6px\">{{charName}} → 角色名 / {{description}} → 描述</div>",
			"<div class=\"om-setting-row\"><textarea id=\"om-tpl-char-single\" rows=\"3\">" + esc$2(d.charSingleTemplate || "【{{charName}}的穿搭】\n{{description}}") + "</textarea></div>",
			"<div class=\"om-divider\"></div>",
			"<div class=\"om-sec-title\">角色衣柜模板 <span class=\"om-hint\">（角色选了多套时生效）</span></div>",
			"<div class=\"om-hint\" style=\"margin-bottom:6px\">{{charName}} → 角色名 / {{wardrobe}} → 穿搭列表</div>",
			"<div class=\"om-setting-row\"><textarea id=\"om-tpl-char-multi\" rows=\"5\">" + esc$2(d.charMultiTemplate || "【{{charName}}的穿搭】\n{{wardrobe}}") + "</textarea></div>",
			"<div class=\"om-divider\"></div>",
			"<div class=\"om-sec-title\">图片模式补充提示</div>",
			"<div class=\"om-setting-row\"><label>单套+图片</label><textarea id=\"om-imgprompt\" rows=\"2\">" + esc$2(d.imagePrompt) + "</textarea></div>",
			"<div class=\"om-setting-row\" style=\"margin-top:6px\"><label>衣柜+图片</label><textarea id=\"om-multi-imgprompt\" rows=\"2\">" + esc$2(d.multiImagePrompt) + "</textarea></div>",
			"<div class=\"om-divider\"></div>",
			"<div class=\"om-sec-title\"><i class=\"fa-solid fa-wand-magic-sparkles\" style=\"margin-right:4px\"></i>描述生成 API <span class=\"om-hint\">（用于批量生成穿搭文字描述，需要 Vision 模型）</span></div>",
			"<div class=\"om-setting-row om-row-inline\"><label>使用酒馆主 API（推荐）</label><input type=\"checkbox\" class=\"om-chk\" id=\"om-use-main-api\"" + (d.useMainApi !== false ? " checked" : "") + " /></div>",
			"<div id=\"om-custom-api-fields\" style=\"display:" + (d.useMainApi !== false ? "none" : "block") + "\">",
			"<div class=\"om-setting-row\"><label>API 地址</label><input type=\"text\" id=\"om-api-v-endpoint\" placeholder=\"https://api.openai.com 或中转站地址\" value=\"" + esc$2(d.apiVision.endpoint) + "\" style=\"background:rgba(127,127,127,.08);border:1px solid rgba(127,127,127,.2);border-radius:8px;color:inherit;padding:7px 10px;font-size:.85em;width:100%;box-sizing:border-box;font-family:inherit\" /></div>",
			"<div class=\"om-setting-row\"><label>API Key</label><input type=\"password\" id=\"om-api-v-key\" placeholder=\"sk-...\" value=\"" + esc$2(d.apiVision.key) + "\" style=\"background:rgba(127,127,127,.08);border:1px solid rgba(127,127,127,.2);border-radius:8px;color:inherit;padding:7px 10px;font-size:.85em;width:100%;box-sizing:border-box;font-family:inherit\" /></div>",
			"<div class=\"om-setting-row\"><label>模型名称</label><div style=\"display:flex;gap:6px;align-items:center\"><input type=\"text\" id=\"om-api-v-model\" placeholder=\"gpt-4o / gemini-2.0-flash / claude-sonnet-4-20250514\" value=\"" + esc$2(d.apiVision.model) + "\" style=\"flex:1;background:rgba(127,127,127,.08);border:1px solid rgba(127,127,127,.2);border-radius:8px;color:inherit;padding:7px 10px;font-size:.85em;box-sizing:border-box;font-family:inherit\" /><button class=\"om-btn om-btn-outline\" id=\"om-api-v-model-fetch\" style=\"font-size:.75em;white-space:nowrap;padding:7px 10px;flex-shrink:0\"><i class=\"fa-solid fa-rotate\"></i> 拉取</button></div></div>",
			"<div class=\"om-setting-row\"><label>并发数 <span class=\"om-hint\">同时发送的请求数，越大越快但可能触发限速（1-5）</span></label><input type=\"number\" id=\"om-api-v-batch\" min=\"1\" max=\"5\" value=\"" + (d.apiVision.concurrency || 3) + "\" style=\"background:rgba(127,127,127,.08);border:1px solid rgba(127,127,127,.2);border-radius:8px;color:inherit;padding:7px 10px;font-size:.85em;width:80px;box-sizing:border-box;font-family:inherit\" /></div>",
			"<div class=\"om-setting-row\"><label>描述生成 Prompt</label><textarea id=\"om-api-v-prompt\" rows=\"3\" style=\"background:rgba(127,127,127,.08);border:1px solid rgba(127,127,127,.2);border-radius:8px;color:inherit;padding:7px 10px;font-size:.85em;width:100%;box-sizing:border-box;resize:vertical;font-family:inherit\">" + esc$2(d.apiVision.prompt) + "</textarea></div>",
			"<div class=\"om-setting-row om-row-inline\"><label>覆盖已有描述</label><input type=\"checkbox\" class=\"om-chk\" id=\"om-api-v-overwrite\"" + (d.apiVision.overwrite ? " checked" : "") + " /></div>",
			"</div>",
			"<div class=\"om-btn-row\" style=\"margin-top:6px\"><button class=\"om-btn om-btn-outline\" id=\"om-api-v-test\" style=\"font-size:.8em\"><i class=\"fa-solid fa-flask-vial\"></i> 测试连接</button></div>",
			"<div class=\"om-divider\"></div>",
			"<div class=\"om-sec-title\">分类管理</div>",
			"<button class=\"om-btn om-btn-outline\" id=\"om-open-cats\" style=\"width:100%;text-align:left\"><i class=\"fa-solid fa-tags\" style=\"margin-right:7px\"></i>管理分类…</button>",
			"<div class=\"om-divider\"></div>",
			"<div class=\"om-sec-title\">数据</div>",
			"<div class=\"om-storage-info\">" + d.outfits.length + " 套穿搭 / " + imgCount + " 张图片 / " + (d.presets ? d.presets.length : 0) + " 个预设 | 酒馆共享存储</div>",
			"<div class=\"om-btn-row\" style=\"margin-top:8px\">",
			"<button class=\"om-btn om-btn-outline\" id=\"om-exp\"><i class=\"fa-solid fa-download\"></i> 导出</button>",
			"<button class=\"om-btn om-btn-outline\" id=\"om-imp\"><i class=\"fa-solid fa-upload\"></i> 导入</button>",
			"<button class=\"om-btn om-btn-danger\" id=\"om-clear\">清空穿搭</button>",
			"</div>",
			"<div class=\"om-divider\"></div>",
			"<div class=\"om-sec-title\">悬浮球</div>",
			"<div class=\"om-setting-row om-row-inline\"><label>显示悬浮球</label><input type=\"checkbox\" class=\"om-chk\" id=\"om-show-ball\"" + (d.showBall !== false ? " checked" : "") + " /></div>",
			"<div class=\"om-divider\"></div>",
			"<div class=\"om-sec-title\">调试</div>",
			"<div class=\"om-setting-row om-row-inline\"><label>注入时显示 Toast 提示</label><input type=\"checkbox\" class=\"om-chk\" id=\"om-debug\"" + (d.debug ? " checked" : "") + " /></div>"
		].join(""));
		sheet.querySelector("#om-mode").addEventListener("change", function() {
			var dd = load$1();
			dd.mode = this.value;
			save$1(dd);
		});
		sheet.querySelector("#om-preset-tpl-sel").addEventListener("change", function() {
			setActiveTemplate(this.value);
			toast$1("已切换模板：" + this.options[this.selectedIndex].textContent);
		});
		sheet.querySelector("#om-preset-import-st").addEventListener("click", function() {
			var dd = load$1();
			applySTPresetToApiConfig(dd);
			save$1(dd);
			toast$1("已尝试导入酒馆预设参数，请检查 API 配置");
		});
		sheet.querySelector("#om-preset-save-st").addEventListener("click", function() {
			if (!saveToSTPreset(load$1().apiVision || {})) toast$1("保存失败，请检查酒馆版本是否支持", true);
		});
		var extFileInput = sheet.querySelector("#om-preset-ext-file");
		sheet.querySelector("#om-preset-import-ext").addEventListener("click", function() {
			extFileInput.click();
		});
		extFileInput.addEventListener("change", function() {
			if (this.files && this.files[0]) {
				importExternalPreset(this.files[0], function(tpl) {
					if (tpl) {
						closeSheet(sheet);
						openSettingsSheet();
					}
				});
				this.value = "";
			}
		});
		sheet.querySelector("#om-preset-new-tpl").addEventListener("click", function() {
			sheet.querySelector("#om-preset-custom-form").style.display = "block";
			sheet.querySelector("#om-preset-edit-area").style.display = "none";
		});
		sheet.querySelector("#om-ctpl-temp").addEventListener("input", function() {
			sheet.querySelector("#om-ctpl-temp-val").textContent = this.value;
		});
		sheet.querySelector("#om-ctpl-save").addEventListener("click", function() {
			var name = sheet.querySelector("#om-ctpl-name").value.trim();
			if (!name) {
				toast$1("请输入模板名称", true);
				return;
			}
			setActiveTemplate(saveCustomTemplate(name, sheet.querySelector("#om-ctpl-sys").value.trim(), sheet.querySelector("#om-ctpl-user").value.trim(), parseFloat(sheet.querySelector("#om-ctpl-temp").value) || .8, parseInt(sheet.querySelector("#om-ctpl-tokens").value) || 600).id);
			closeSheet(sheet);
			openSettingsSheet();
			toast$1("模板「" + name + "」已保存并选中");
		});
		sheet.querySelector("#om-ctpl-cancel").addEventListener("click", function() {
			sheet.querySelector("#om-preset-custom-form").style.display = "none";
		});
		sheet.querySelector("#om-preset-tpl-sel").addEventListener("dblclick", function() {
			var selId = this.value;
			var all = getAllTemplates();
			var tpl = null;
			for (var i = 0; i < all.length; i++) if (all[i].id === selId) {
				tpl = all[i];
				break;
			}
			if (!tpl) return;
			sheet.querySelector("#om-ptpl-edit-title").textContent = "编辑：" + tpl.name;
			sheet.querySelector("#om-ptpl-sys").value = tpl.systemPrompt || "";
			sheet.querySelector("#om-ptpl-user").value = tpl.userPromptPrefix || "";
			sheet.querySelector("#om-ptpl-temp").value = tpl.temperature || .8;
			sheet.querySelector("#om-ptpl-temp-val").textContent = tpl.temperature || .8;
			sheet.querySelector("#om-ptpl-tokens").value = tpl.maxTokens || 600;
			sheet.querySelector("#om-preset-edit-area").style.display = "block";
			sheet.querySelector("#om-preset-custom-form").style.display = "none";
			sheet.querySelector("#om-preset-edit-area").dataset.tplId = selId;
			sheet.querySelector("#om-preset-edit-area").dataset.isCustom = selId.indexOf("custom_") === 0 ? "1" : "";
		});
		sheet.querySelector("#om-ptpl-temp").addEventListener("input", function() {
			sheet.querySelector("#om-ptpl-temp-val").textContent = this.value;
		});
		sheet.querySelector("#om-ptpl-save").addEventListener("click", function() {
			var area = sheet.querySelector("#om-preset-edit-area");
			var tplId = area.dataset.tplId;
			if (area.dataset.isCustom === "1") {
				var dd = load$1();
				if (dd.customTemplates) {
					for (var i = 0; i < dd.customTemplates.length; i++) if (dd.customTemplates[i].id === tplId) {
						dd.customTemplates[i].systemPrompt = sheet.querySelector("#om-ptpl-sys").value.trim();
						dd.customTemplates[i].userPromptPrefix = sheet.querySelector("#om-ptpl-user").value.trim();
						dd.customTemplates[i].temperature = parseFloat(sheet.querySelector("#om-ptpl-temp").value) || .8;
						dd.customTemplates[i].maxTokens = parseInt(sheet.querySelector("#om-ptpl-tokens").value) || 600;
						break;
					}
					save$1(dd);
				}
			}
			closeSheet(sheet);
			openSettingsSheet();
			toast$1("模板已更新");
		});
		sheet.querySelector("#om-ptpl-cancel").addEventListener("click", function() {
			sheet.querySelector("#om-preset-edit-area").style.display = "none";
		});
		sheet.querySelector("#om-inject-pos").addEventListener("change", function() {
			var dd = load$1();
			dd.injectPosition = this.value;
			save$1(dd);
		});
		sheet.querySelector("#om-auto-roll").addEventListener("change", function() {
			var dd = load$1();
			dd.autoRollDisabled = !this.checked;
			save$1(dd);
		});
		sheet.querySelector("#om-tpl-single").addEventListener("input", function() {
			var dd = load$1();
			dd.singleTemplate = this.value;
			save$1(dd);
		});
		sheet.querySelector("#om-tpl-multi").addEventListener("input", function() {
			var dd = load$1();
			dd.multiTemplate = this.value;
			save$1(dd);
		});
		sheet.querySelector("#om-tpl-char-single").addEventListener("input", function() {
			var dd = load$1();
			dd.charSingleTemplate = this.value;
			save$1(dd);
		});
		sheet.querySelector("#om-tpl-char-multi").addEventListener("input", function() {
			var dd = load$1();
			dd.charMultiTemplate = this.value;
			save$1(dd);
		});
		sheet.querySelector("#om-imgprompt").addEventListener("input", function() {
			var dd = load$1();
			dd.imagePrompt = this.value;
			save$1(dd);
		});
		sheet.querySelector("#om-multi-imgprompt").addEventListener("input", function() {
			var dd = load$1();
			dd.multiImagePrompt = this.value;
			save$1(dd);
		});
		sheet.querySelector("#om-api-v-endpoint").addEventListener("input", function() {
			var dd = load$1();
			dd.apiVision.endpoint = this.value.trim();
			save$1(dd);
		});
		sheet.querySelector("#om-api-v-key").addEventListener("input", function() {
			var dd = load$1();
			dd.apiVision.key = this.value.trim();
			save$1(dd);
		});
		sheet.querySelector("#om-api-v-model").addEventListener("input", function() {
			var dd = load$1();
			dd.apiVision.model = this.value.trim();
			save$1(dd);
		});
		sheet.querySelector("#om-api-v-batch").addEventListener("change", function() {
			var dd = load$1();
			dd.apiVision.concurrency = Math.max(1, Math.min(5, parseInt(this.value) || 3));
			save$1(dd);
		});
		sheet.querySelector("#om-api-v-prompt").addEventListener("input", function() {
			var dd = load$1();
			dd.apiVision.prompt = this.value;
			save$1(dd);
		});
		sheet.querySelector("#om-api-v-overwrite").addEventListener("change", function() {
			var dd = load$1();
			dd.apiVision.overwrite = this.checked;
			save$1(dd);
		});
		sheet.querySelector("#om-use-main-api").addEventListener("change", function() {
			var dd = load$1();
			dd.useMainApi = this.checked;
			if (this.checked) autoDetectApiConfig(dd);
			save$1(dd);
			var fields = sheet.querySelector("#om-custom-api-fields");
			if (fields) fields.style.display = this.checked ? "none" : "block";
		});
		sheet.querySelector("#om-api-v-test").addEventListener("click", function() {
			var dd = load$1();
			if (!dd.apiVision.endpoint || !dd.apiVision.key || !dd.apiVision.model) {
				toast$1("请先填写 API 地址、Key 和模型名称", true);
				return;
			}
			toast$1("正在测试...");
			fetch(normalizeEndpoint(dd.apiVision.endpoint, "chat"), {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer " + dd.apiVision.key
				},
				body: JSON.stringify({
					model: dd.apiVision.model,
					messages: [{
						role: "user",
						content: "回复OK"
					}],
					max_tokens: 10
				})
			}).then(function(r) {
				if (!r.ok) return r.text().then(function(t) {
					throw new Error("HTTP " + r.status);
				});
				return r.json();
			}).then(function() {
				toast$1("✅ 描述 API 连接成功！");
			}).catch(function(e) {
				toast$1("❌ 连接失败：" + e.message, true);
			});
		});
		var vModelFetch = sheet.querySelector("#om-api-v-model-fetch");
		if (vModelFetch) vModelFetch.addEventListener("click", function() {
			var dd = load$1();
			if (!dd.apiVision.endpoint || !dd.apiVision.key) {
				toast$1("请先填写 API 地址和 Key", true);
				return;
			}
			openModelPicker(dd.apiVision, function(model) {
				dd = load$1();
				dd.apiVision.model = model;
				save$1(dd);
				var inp = sheet.querySelector("#om-api-v-model");
				if (inp) inp.value = model;
			}, getDarkMode());
		});
		sheet.querySelector("#om-show-ball").addEventListener("change", function() {
			var dd = load$1();
			dd.showBall = this.checked;
			save$1(dd);
			var oldFab = document.getElementById(FAB_ID);
			if (oldFab) oldFab.parentNode.removeChild(oldFab);
			if (dd.showBall) injectFab();
		});
		sheet.querySelector("#om-debug").addEventListener("change", function() {
			var dd = load$1();
			dd.debug = this.checked;
			save$1(dd);
		});
		sheet.querySelector("#om-exp").addEventListener("click", function() {
			_exportData();
		});
		sheet.querySelector("#om-imp").addEventListener("click", function() {
			_importData();
		});
		sheet.querySelector("#om-clear").addEventListener("click", function() {
			var dd = load$1();
			var label = dd.currentView === "char" && dd.currentChar ? "「" + dd.currentChar + "」的穿搭" : "User 的穿搭";
			if (!confirm("确定清空" + label + "？（其他数据不受影响）")) return;
			if (dd.currentView === "char" && dd.currentChar) {
				var cd = getCharData(dd, dd.currentChar);
				cd.outfits = [];
				cd.categories = [];
				cd.activeIds = [];
			} else {
				dd.outfits = [];
				dd.categories = [];
				dd.activeIds = [];
			}
			save$1(dd);
			closeSheet(sheet);
			renderCatbar();
			renderGrid$1();
			renderBottomStatus$1();
			updateBtn$1();
			toast$1("已清空");
		});
		sheet.querySelector("#om-open-cats").addEventListener("click", function() {
			closeSheet(sheet);
			openCatsSheet();
		});
	}
	function openCatsSheet() {
		var d = load$1();
		var cats = getViewCategories(d);
		var viewOutfits = getViewOutfits(d);
		var viewLabel = d.currentView === "char" && d.currentChar ? d.currentChar + "的" : "User的";
		var listHTML = cats.length === 0 ? "<div class=\"om-empty\"><i class=\"fa-solid fa-tags\"></i><span>还没有分类</span></div>" : cats.map(function(cat, idx) {
			var n = viewOutfits.filter(function(o) {
				return o.category === cat;
			}).length;
			return "<div class=\"om-cat-item\"><span class=\"om-cat-name\">" + esc$2(cat) + "</span><span class=\"om-cat-count\">" + n + "套</span><button class=\"om-btn-sm om-cat-ren\" data-idx=\"" + idx + "\" title=\"重命名\"><i class=\"fa-solid fa-pen\"></i></button><button class=\"om-btn-sm om-cat-del\" data-idx=\"" + idx + "\" title=\"删除\"><i class=\"fa-solid fa-trash\"></i></button></div>";
		}).join("");
		var sheet = createSheet([
			"<div class=\"om-sheet-title\"><i class=\"fa-solid fa-tags\"></i>" + esc$2(viewLabel) + "分类管理</div>",
			listHTML,
			"<div class=\"om-divider\"></div>",
			"<div class=\"om-cat-add-row\"><input type=\"text\" id=\"om-newcat\" placeholder=\"新分类名称…\" /><button class=\"om-btn om-btn-safe\" id=\"om-newadd\">添加</button></div>"
		].join(""));
		var inp = sheet.querySelector("#om-newcat");
		sheet.querySelector("#om-newadd").addEventListener("click", function() {
			var name = inp.value.trim();
			if (!name) return;
			var dd = load$1();
			var vc = getViewCategories(dd);
			if (vc.indexOf(name) === -1) {
				vc.push(name);
				save$1(dd);
				inp.value = "";
				closeSheet(sheet);
				renderCatbar();
				openCatsSheet();
				toast$1("分类「" + name + "」已添加");
			} else toast$1("分类已存在", true);
		});
		inp.addEventListener("keydown", function(e) {
			if (e.key === "Enter") sheet.querySelector("#om-newadd").click();
		});
		sheet.querySelectorAll(".om-cat-ren").forEach(function(btn) {
			btn.addEventListener("click", function() {
				var dd = load$1();
				var vc = getViewCategories(dd);
				var vo = getViewOutfits(dd);
				var idx = parseInt(btn.dataset.idx);
				var old = vc[idx];
				var nw = prompt("重命名（原：" + old + "）：", old);
				if (!nw || !nw.trim() || nw.trim() === old) return;
				nw = nw.trim();
				vc[idx] = nw;
				vo.forEach(function(o) {
					if (o.category === old) o.category = nw;
				});
				save$1(dd);
				closeSheet(sheet);
				renderCatbar();
				openCatsSheet();
				toast$1("已重命名");
			});
		});
		sheet.querySelectorAll(".om-cat-del").forEach(function(btn) {
			btn.addEventListener("click", function() {
				var dd = load$1();
				var vc = getViewCategories(dd);
				var vo = getViewOutfits(dd);
				var idx = parseInt(btn.dataset.idx);
				var name = vc[idx];
				if (!confirm("删除分类「" + name + "」？（穿搭不会被删除）")) return;
				vc.splice(idx, 1);
				vo.forEach(function(o) {
					if (o.category === name) o.category = "";
				});
				if (getCurCat() === name) setCurCat("__all__");
				save$1(dd);
				closeSheet(sheet);
				renderCatbar();
				openCatsSheet();
				toast$1("已删除");
			});
		});
	}
	//#endregion
	//#region src/ui/context-menu.js
	function openContextMenu(outfit, imgOutfits) {
		if (!outfit) return;
		var isOn = isActive(load$1(), outfit.id);
		var sheet = createSheet([
			"<div class=\"om-ctx-outfit-name\"><i class=\"fa-solid fa-shirt\" style=\"margin-right:6px;opacity:.5;\"></i>" + esc$2(outfit.name) + "</div>",
			isOn ? "<div class=\"om-ctx-item\" id=\"om-ctx-wear\"><i class=\"fa-solid fa-circle-xmark\"></i>取消选择</div>" : "<div class=\"om-ctx-item\" id=\"om-ctx-wear\"><i class=\"fa-solid fa-circle-check\"></i>选择穿搭</div>",
			hasImages(outfit) ? "<div class=\"om-ctx-item\" id=\"om-ctx-view\"><i class=\"fa-solid fa-expand\"></i>查看大图</div>" : "",
			"<div class=\"om-ctx-item\" id=\"om-ctx-edit\"><i class=\"fa-solid fa-pen\"></i>编辑</div>",
			hasImages(outfit) ? "<div class=\"om-ctx-item\" id=\"om-ctx-aidesc\"><i class=\"fa-solid fa-wand-magic-sparkles\"></i>AI 生成描述</div>" : "",
			"<div class=\"om-ctx-item danger\" id=\"om-ctx-del\"><i class=\"fa-solid fa-trash\"></i>删除</div>"
		].join(""));
		var wearEl = sheet.querySelector("#om-ctx-wear");
		if (wearEl) wearEl.addEventListener("click", function() {
			closeSheet(sheet);
			var dd = load$1();
			var aids = getViewActiveIds(dd);
			var idx = aids.indexOf(outfit.id);
			if (idx !== -1) aids.splice(idx, 1);
			else aids.push(outfit.id);
			setViewActiveIds(dd, aids);
			save$1(dd);
			updateBtn();
			renderBottomStatus$1();
			renderGrid$1();
			closeDetailPanel();
		});
		var viewEl = sheet.querySelector("#om-ctx-view");
		if (viewEl) viewEl.addEventListener("click", function() {
			closeSheet(sheet);
			openLightbox(imgOutfits, outfit.id);
		});
		var editEl = sheet.querySelector("#om-ctx-edit");
		if (editEl) editEl.addEventListener("click", function() {
			closeSheet(sheet);
			openEditSheet(outfit, outfit.category || "");
		});
		var aidescEl = sheet.querySelector("#om-ctx-aidesc");
		if (aidescEl) aidescEl.addEventListener("click", function() {
			var dd = load$1();
			if (!dd.apiVision.endpoint || !dd.apiVision.key || !dd.apiVision.model) {
				toast$1("请先在设置中配置\"描述生成 API\"", true);
				closeSheet(sheet);
				return;
			}
			aidescEl.innerHTML = "<i class=\"fa-solid fa-spinner fa-spin\"></i>生成中...";
			aidescEl.style.pointerEvents = "none";
			generateSingleDescription(outfit, function(err, desc) {
				closeSheet(sheet);
				if (err) {
					toast$1("生成失败：" + err, true);
					return;
				}
				var dd2 = load$1();
				var o = getById(dd2, outfit.id);
				if (o) {
					o.description = desc;
					save$1(dd2);
				}
				toast$1("✅ 描述已生成：" + outfit.name);
				renderGrid$1();
			});
		});
		var delEl = sheet.querySelector("#om-ctx-del");
		if (delEl) delEl.addEventListener("click", function() {
			closeSheet(sheet);
			if (!confirm("确定删除「" + outfit.name + "」？")) return;
			var dd = load$1();
			dd.outfits = dd.outfits.filter(function(o) {
				return o.id !== outfit.id;
			});
			if (dd.chars) for (var cn in dd.chars) {
				dd.chars[cn].outfits = (dd.chars[cn].outfits || []).filter(function(o) {
					return o.id !== outfit.id;
				});
				var cai = (dd.chars[cn].activeIds || []).indexOf(outfit.id);
				if (cai !== -1) dd.chars[cn].activeIds.splice(cai, 1);
			}
			var ai = (dd.activeIds || []).indexOf(outfit.id);
			if (ai !== -1) dd.activeIds.splice(ai, 1);
			save$1(dd);
			updateBtn();
			renderBottomStatus$1();
			renderGrid$1();
			toast$1("已删除");
		});
	}
	//#endregion
	//#region src/ui/modals.js
	function openBatchDescModal(ids) {
		var d = load$1();
		var darkMode = getDarkMode();
		var withImg = ids.filter(function(id) {
			var o = getById(d, id);
			return o && hasImages(o);
		});
		var skipCount = ids.length - withImg.length;
		var willSkipDesc = withImg.filter(function(id) {
			var o = getById(d, id);
			return o && o.description && o.description.trim() && !d.apiVision.overwrite;
		}).length;
		var modal = document.createElement("div");
		modal.className = "om-modal";
		modal.style.setProperty("z-index", "2147483647", "important");
		modal.innerHTML = "<div class=\"om-modal-box\" style=\"background:" + (darkMode ? "#1e1e24" : "#ececef") + ";color:" + (darkMode ? "#eee" : "#111") + "\"><div class=\"om-modal-title\"><i class=\"fa-solid fa-wand-magic-sparkles\" style=\"margin-right:6px;color:var(--SmartThemeQuoteColor,#7c6daf)\"></i>AI 批量生成描述</div><div style=\"font-size:.82em;opacity:.7;margin-bottom:8px\">共选中 " + ids.length + " 套，其中 " + withImg.length + " 套有图片" + (skipCount > 0 ? "，" + skipCount + " 套无图片将跳过" : "") + (willSkipDesc > 0 ? "<br>" + willSkipDesc + " 套已有描述将跳过（可在设置中开启覆盖）" : "") + "</div><div style=\"font-size:.78em;opacity:.5;margin-bottom:6px\">逐张发送，并发 " + (d.apiVision.concurrency || 3) + " 个请求，共需 " + (withImg.length - willSkipDesc) + " 次 API 调用</div><div id=\"om-batch-progress\" style=\"display:none;margin:10px 0\"><div style=\"font-size:.82em;margin-bottom:6px\" id=\"om-batch-prog-text\">准备中...</div><div style=\"height:6px;background:rgba(127,127,127,.15);border-radius:3px;overflow:hidden\"><div id=\"om-batch-prog-bar\" style=\"height:100%;width:0%;background:var(--SmartThemeQuoteColor,#7c6daf);border-radius:3px;transition:width .3s\"></div></div></div><div id=\"om-batch-result\" style=\"display:none;margin:8px 0;font-size:.82em;max-height:120px;overflow-y:auto\"></div><div class=\"om-btn-row\" style=\"margin-top:10px\" id=\"om-batch-actions\"><button class=\"om-btn om-btn-safe\" id=\"om-batch-start\"><i class=\"fa-solid fa-play\"></i> 开始生成</button><button class=\"om-btn om-btn-outline\" id=\"om-batch-close\">取消</button></div></div>";
		var _mp = getPopupLayer$1();
		modal.style.cssText = "position:absolute !important;inset:0 !important;z-index:1 !important;background:rgba(0,0,0,.45) !important;display:flex !important;align-items:center !important;justify-content:center !important;padding:20px !important;box-sizing:border-box !important;pointer-events:auto !important;";
		_mp.appendChild(modal);
		modal.addEventListener("click", function(e) {
			if (e.target === modal && !modal.dataset.running) _mp.removeChild(modal);
		});
		modal.querySelector("#om-batch-close").addEventListener("click", function() {
			if (!modal.dataset.running) _mp.removeChild(modal);
		});
		modal.querySelector("#om-batch-start").addEventListener("click", function() {
			modal.dataset.running = "1";
			modal.querySelector("#om-batch-progress").style.display = "block";
			modal.querySelector("#om-batch-start").disabled = true;
			modal.querySelector("#om-batch-start").textContent = "生成中...";
			modal.querySelector("#om-batch-close").textContent = "请等待...";
			batchGenerateDescriptions(ids, function(done, total, msg) {
				var pct = total > 0 ? Math.round(done / total * 100) : 0;
				var bar = modal.querySelector("#om-batch-prog-bar");
				var txt = modal.querySelector("#om-batch-prog-text");
				if (bar) bar.style.width = pct + "%";
				if (txt) txt.textContent = msg;
			}, function(err, doneCount, errors) {
				delete modal.dataset.running;
				var bar = modal.querySelector("#om-batch-prog-bar");
				if (bar) bar.style.width = "100%";
				var resultEl = modal.querySelector("#om-batch-result");
				resultEl.style.display = "block";
				if (err && !doneCount) resultEl.innerHTML = "<div style=\"color:#e57373\"><i class=\"fa-solid fa-circle-exclamation\"></i> " + esc$2(err) + "</div>";
				else {
					var html2 = "<div style=\"color:#4caf50;font-weight:600\">✅ 成功生成 " + ((doneCount || 0) - (errors ? errors.length : 0)) + " 条描述</div>";
					if (errors && errors.length > 0) {
						html2 += "<div style=\"color:#ff8c42;margin-top:4px\">⚠️ " + errors.length + " 个失败：</div>";
						errors.forEach(function(e) {
							html2 += "<div style=\"opacity:.6;font-size:.9em;margin-left:8px\">· " + esc$2(e.name) + "：" + esc$2(e.error) + "</div>";
						});
					}
					resultEl.innerHTML = html2;
				}
				var actionsEl = modal.querySelector("#om-batch-actions");
				actionsEl.innerHTML = "<button class=\"om-btn om-btn-safe\" id=\"om-batch-done\">完成</button>";
				modal.querySelector("#om-batch-done").addEventListener("click", function() {
					_mp.removeChild(modal);
					renderGrid$1();
				});
			});
		});
	}
	//#endregion
	//#region src/ui/detail-panel.js
	var detailPanelOpen = false;
	function toggleDetailPanel() {
		if (detailPanelOpen) {
			closeDetailPanel$1();
			return;
		}
		var d = load$1();
		var groups = [];
		var userNames = [];
		(d.activeIds || []).forEach(function(id) {
			var o = getById(d, id);
			if (o) userNames.push({
				id,
				name: o.name
			});
		});
		if (userNames.length > 0) groups.push({
			owner: "User",
			items: userNames
		});
		if (d.chars) for (var cn in d.chars) {
			var cd = d.chars[cn];
			var charNames = [];
			(cd.activeIds || []).forEach(function(id) {
				for (var k = 0; k < (cd.outfits || []).length; k++) if (cd.outfits[k].id === id) {
					charNames.push({
						id,
						name: cd.outfits[k].name
					});
					break;
				}
			});
			if (charNames.length > 0) groups.push({
				owner: cn,
				items: charNames
			});
		}
		if (groups.length === 0) return;
		openDetailPanel(groups, d);
	}
	function openDetailPanel(groups, d) {
		closeDetailPanel$1();
		var bottombar = document.getElementById("om-bottombar");
		if (!bottombar) return;
		detailPanelOpen = true;
		var panel = document.createElement("div");
		panel.id = "om-detail-panel";
		panel.className = "om-detail-panel";
		panel.style.cssText = "position:absolute;bottom:100%;left:0;right:0;z-index:10;";
		var html = "<div class=\"om-detail-handle\"></div>";
		groups.forEach(function(g) {
			html += "<div class=\"om-detail-title\" style=\"margin-top:4px\">" + esc$2(g.owner) + "</div>";
			html += "<div class=\"om-detail-tags\">";
			g.items.forEach(function(w) {
				html += "<span class=\"om-detail-tag\" data-id=\"" + w.id + "\">" + esc$2(w.name) + "<button class=\"om-detail-tag-x\" data-id=\"" + w.id + "\">&#x2715;</button></span>";
			});
			html += "</div>";
		});
		panel.innerHTML = html;
		bottombar.appendChild(panel);
		panel.querySelectorAll(".om-detail-tag-x").forEach(function(btn) {
			btn.addEventListener("click", function(e) {
				e.stopPropagation();
				var dd = load$1();
				var id = btn.dataset.id;
				var ai1 = (dd.activeIds || []).indexOf(id);
				if (ai1 !== -1) dd.activeIds.splice(ai1, 1);
				if (dd.chars) for (var cn in dd.chars) {
					var cai = (dd.chars[cn].activeIds || []).indexOf(id);
					if (cai !== -1) dd.chars[cn].activeIds.splice(cai, 1);
				}
				save$1(dd);
				updateBtn();
				renderBottomStatus();
				renderGrid();
				closeDetailPanel$1();
			});
			panel.querySelectorAll(".om-detail-tag").forEach(function(tag) {
				tag.addEventListener("click", function(e) {
					e.stopPropagation();
					if (e.target.closest(".om-detail-tag-x")) return;
					var id = tag.dataset.id;
					var o = getById(load$1(), id);
					if (!o) return;
					closeDetailPanel$1();
					var darkMode = getDarkMode();
					getPopupLayer$1().querySelectorAll(".om-modal").forEach(function(el) {
						el.remove();
					});
					var modal = document.createElement("div");
					modal.className = "om-modal";
					var bg = darkMode ? "#1e1e24" : "#ececef";
					var fg = darkMode ? "#eee" : "#111";
					modal.innerHTML = "<div class=\"om-modal-box\" style=\"max-width:500px;background:" + bg + ";color:" + fg + "\"><div class=\"om-modal-title\" style=\"font-size:1.1em\"><i class=\"fa-solid fa-pen-to-square\"></i> " + esc$2("编辑：" + o.name) + "</div><textarea id=\"om-edit-desc\" style=\"width:100%;min-height:180px;margin-top:12px;background:rgba(127,127,127,.08);border:1px solid rgba(127,127,127,.3);border-radius:10px;padding:12px;font-size:.9em;line-height:1.75;color:" + fg + ";resize:vertical;font-family:inherit\">" + (o.description || "") + "</textarea><div class=\"om-btn-row\" style=\"margin-top:12px;gap:10px\"><button class=\"om-btn om-btn-safe\" id=\"om-edit-save\"><i class=\"fa-solid fa-check\"></i> 确认</button><button class=\"om-btn\" id=\"om-edit-wardrobe\" style=\"background:var(--SmartThemeQuoteColor,#7c6daf);color:#fff\"><i class=\"fa-solid fa-box\"></i> 保存到衣橱</button><button class=\"om-btn om-btn-outline\" id=\"om-edit-close\">关闭</button></div></div>";
					var mp = getPopupLayer$1();
					modal.style.cssText = "position:absolute !important;inset:0 !important;z-index:2 !important;background:rgba(0,0,0,.45) !important;display:flex !important;align-items:center !important;justify-content:center !important;padding:20px !important;box-sizing:border-box !important;pointer-events:auto !important;";
					mp.appendChild(modal);
					modal.addEventListener("click", function(ev) {
						if (ev.target === modal) modal.remove();
					});
					modal.querySelector("#om-edit-save").addEventListener("click", function(e) {
						e.stopPropagation();
						var newDesc = modal.querySelector("#om-edit-desc").value;
						var dd2 = load$1();
						var o2 = getById(dd2, id);
						if (o2) {
							o2.description = newDesc;
							save$1(dd2);
						}
						modal.remove();
						if (o2) {
							renderGrid();
							renderBottomStatus();
							updateBtn();
						}
						toast$1("穿搭描述已更新");
					});
					modal.querySelector("#om-edit-close").addEventListener("click", function(e) {
						e.stopPropagation();
						modal.remove();
					});
					modal.querySelector("#om-edit-wardrobe").addEventListener("click", function(e) {
						e.stopPropagation();
						var newDesc = modal.querySelector("#om-edit-desc").value;
						var dd2 = load$1();
						var o2 = getById(dd2, id);
						if (o2) {
							var saved = {
								id: genId(),
								name: o2.name,
								category: "世界书",
								type: "outfit",
								style: o2.style || "",
								season: o2.season || "",
								sceneTag: o2.sceneTag || "",
								description: newDesc,
								images: o2.images && o2.images.length > 0 ? o2.images.slice() : o2.imageData ? [o2.imageData] : [],
								createdAt: Date.now()
							};
							dd2.outfits.push(saved);
							save$1(dd2);
							renderGrid();
							updateBtn();
						}
						modal.remove();
						toast$1("已保存到衣橱");
					});
				});
			});
		});
		setTimeout(function() {
			document.addEventListener("click", outsideDetailClick, true);
		}, 10);
	}
	function outsideDetailClick(e) {
		var panel = document.getElementById("om-detail-panel");
		var statusEl = document.getElementById("om-bottom-status");
		if (panel && !panel.contains(e.target) && statusEl && !statusEl.contains(e.target)) closeDetailPanel$1();
	}
	function closeDetailPanel$1() {
		detailPanelOpen = false;
		var p = document.getElementById("om-detail-panel");
		if (p && p.parentNode) p.parentNode.removeChild(p);
		document.removeEventListener("click", outsideDetailClick, true);
	}
	//#endregion
	//#region src/ui/popup.js
	var curCat = "__all__";
	var curType = "__all__";
	var batchMode = false;
	var batchSelected = [];
	var searchQuery = "";
	var searchOpen = false;
	var charPanelExpanded = false;
	var collapsedGroups = {};
	var wbMode = false;
	function getCurCat() {
		return curCat;
	}
	function setCurCat(v) {
		curCat = v;
	}
	function openPopup() {
		if (document.querySelector(".om-overlay")) return;
		var shield = document.createElement("div");
		shield.setAttribute("style", "position:fixed;top:0;left:0;right:0;bottom:0;z-index:2147483646;");
		shield.addEventListener("touchstart", function(e) {
			e.preventDefault();
			e.stopPropagation();
		}, { passive: false });
		shield.addEventListener("click", function(e) {
			e.preventDefault();
			e.stopPropagation();
		}, { passive: false });
		document.body.appendChild(shield);
		setTimeout(function() {
			if (shield.parentNode) shield.parentNode.removeChild(shield);
		}, 400);
		injectStyles();
		batchMode = false;
		batchSelected = [];
		searchQuery = "";
		searchOpen = false;
		var ov = document.createElement("div");
		var darkMode = getDarkMode();
		ov.className = "om-overlay " + (darkMode ? "om-dark" : "om-light");
		ov.setAttribute("style", "position:fixed !important;top:0 !important;left:0 !important;right:0 !important;bottom:0 !important;z-index:2147483646 !important;");
		ov.innerHTML = "<div class=\"om-box\"><div class=\"om-head\"><div class=\"om-head-title\"><i class=\"fa-solid fa-shirt\"></i>" + SCRIPT_NAME + "</div><div class=\"om-head-actions\"><button class=\"om-icon-btn\" id=\"om-search-toggle\" title=\"搜索\"><i class=\"fa-solid fa-magnifying-glass\"></i></button><button class=\"om-theme-btn\" id=\"om-theme-toggle\"><i class=\"fa-solid fa-circle-half-stroke\"></i></button><button class=\"om-icon-btn\" id=\"om-x\" title=\"关闭\"><i class=\"fa-solid fa-xmark\"></i></button></div></div><div class=\"om-search-bar\" id=\"om-search-bar\"><div class=\"om-search-wrap\"><i class=\"fa-solid fa-magnifying-glass\"></i><input class=\"om-search-inp\" id=\"om-search-inp\" type=\"text\" placeholder=\"搜索名称或标签…\" autocomplete=\"off\" /></div><button class=\"om-search-clear\" id=\"om-search-clear\" title=\"关闭搜索\"><i class=\"fa-solid fa-xmark\"></i></button></div><div class=\"om-viewbar\" id=\"om-viewbar\"></div><div class=\"om-catbar\" id=\"om-catbar\"></div><div class=\"om-quick-scenes\" id=\"om-quick-scenes\"></div><div class=\"om-grid-area\" id=\"om-grid-area\"></div><div class=\"om-bottombar\" id=\"om-bottombar\" style=\"position:relative;\"><div class=\"om-bottom-status\" id=\"om-bottom-status\"></div><button class=\"om-batch-toggle-btn\" id=\"om-batch-toggle\">多选</button><button class=\"om-bottom-btn\" id=\"om-bottom-presets\" title=\"预设\"><i class=\"fa-solid fa-bookmark\"></i></button><button class=\"om-bottom-btn\" id=\"om-bottom-roll\" title=\"随机搭配\"><i class=\"fa-solid fa-dice\"></i></button><button class=\"om-bottom-btn\" id=\"om-bottom-settings\" title=\"设置\"><i class=\"fa-solid fa-sliders\"></i></button></div></div><div id=\"om-popup-slot\" style=\"position:absolute;inset:0;z-index:999;pointer-events:none;\"></div>";
		document.body.appendChild(ov);
		renderQuickScenes(load$1());
		ov.querySelector("#om-x").addEventListener("click", closePopup);
		ov.querySelector("#om-theme-toggle").addEventListener("click", function() {
			darkMode = !darkMode;
			setDarkMode(darkMode);
			var overlay = document.querySelector(".om-overlay");
			if (overlay) {
				overlay.classList.toggle("om-dark", darkMode);
				overlay.classList.toggle("om-light", !darkMode);
			}
			var btn = ov.querySelector("#om-theme-toggle");
			if (btn) btn.innerHTML = darkMode ? "<i class=\"fa-solid fa-circle-half-stroke\"></i>" : "<i class=\"fa-regular fa-sun\"></i>";
		});
		ov.querySelector("#om-search-toggle").addEventListener("click", function() {
			searchOpen = !searchOpen;
			document.getElementById("om-search-bar").classList.toggle("open", searchOpen);
			if (searchOpen) setTimeout(function() {
				var i = document.getElementById("om-search-inp");
				if (i) i.focus();
			}, 50);
			else {
				searchQuery = "";
				renderGrid$1();
			}
		});
		ov.querySelector("#om-search-clear").addEventListener("click", function() {
			searchOpen = false;
			searchQuery = "";
			document.getElementById("om-search-bar").classList.remove("open");
			renderGrid$1();
		});
		var sinp = ov.querySelector("#om-search-inp");
		sinp.addEventListener("input", function() {
			searchQuery = sinp.value;
			renderGrid$1();
		});
		sinp.addEventListener("keydown", function(e) {
			if (e.key === "Escape") {
				searchOpen = false;
				searchQuery = "";
				ov.querySelector("#om-search-bar").classList.remove("open");
				renderGrid$1();
			}
		});
		ov.querySelector("#om-bottom-status").addEventListener("click", function() {
			toggleDetailPanel();
		});
		ov.querySelector("#om-batch-toggle").addEventListener("click", function() {
			batchMode = !batchMode;
			batchSelected = [];
			ov.querySelector("#om-batch-toggle").classList.toggle("on", batchMode);
			renderGrid$1();
		});
		ov.querySelector("#om-bottom-presets").addEventListener("click", function() {
			openPresetsSheet();
		});
		ov.querySelector("#om-bottom-settings").addEventListener("click", function() {
			openSettingsSheet();
		});
		ov.querySelector("#om-bottom-roll").addEventListener("click", function() {
			openRandomRoll();
		});
		renderViewbar();
		renderCatbar();
		renderGrid$1();
		renderBottomStatus$1();
		setTimeout(function() {
			renderQuickScenes(load$1());
		}, 300);
		setTimeout(function() {
			renderQuickScenes(load$1());
		}, 1200);
		closeFab();
	}
	function closePopup() {
		var ov = document.querySelector(".om-overlay");
		if (ov) ov.parentNode.removeChild(ov);
		injectFab();
	}
	function renderViewbar() {
		var vbar = document.getElementById("om-viewbar");
		if (!vbar) return;
		var d = load$1();
		var isUser = d.currentView !== "char";
		vbar.style.position = "relative";
		var html = "<button class=\"om-viewtab" + (isUser ? " on" : "") + "\" data-v=\"user\"><i class=\"fa-solid fa-user\" style=\"margin-right:4px\"></i>User</button><button class=\"om-viewtab" + (!isUser ? " on" : "") + "\" data-v=\"char\"><i class=\"fa-solid fa-masks-theater\" style=\"margin-right:4px\"></i>角色</button><button class=\"om-viewtab\" id=\"om-wb-toggle\" title=\"混合世界书风格\"><i class=\"fa-solid fa-book\" style=\"margin-right:4px\"></i>世界书</button>";
		if (!isUser) html += "<input type=\"text\" class=\"om-char-input\" id=\"om-char-input\" placeholder=\"" + (d.currentChar ? esc$2(d.currentChar) : "搜索角色…") + "\" autocomplete=\"off\" /><button class=\"om-char-add-btn\" id=\"om-char-add\" title=\"添加角色\">+</button>";
		vbar.innerHTML = html;
		vbar.querySelectorAll(".om-viewtab").forEach(function(tab) {
			tab.addEventListener("click", function() {
				var dd = load$1();
				dd.currentView = tab.dataset.v;
				save$1(dd);
				charPanelExpanded = false;
				renderViewbar();
				renderCatbar();
				renderGrid$1();
				renderBottomStatus$1();
			});
		});
		var wbBtn = vbar.querySelector("#om-wb-toggle");
		if (wbBtn) {
			wbBtn.classList.toggle("on", wbMode);
			wbBtn.addEventListener("click", function() {
				wbMode = !wbMode;
				vbar.querySelector("#om-wb-toggle").classList.toggle("on", wbMode);
				renderGrid$1();
			});
		}
		if (!isUser) {
			var inp = vbar.querySelector("#om-char-input");
			inp.addEventListener("focus", function() {
				charPanelExpanded = true;
				renderCharDropdown(vbar, load$1(), "");
			});
			inp.addEventListener("input", function() {
				charPanelExpanded = true;
				renderCharDropdown(vbar, load$1(), this.value.trim().toLowerCase());
			});
			vbar.querySelector("#om-char-add").addEventListener("click", function() {
				addCharPrompt();
			});
			if (charPanelExpanded) renderCharDropdown(vbar, d, "");
		}
	}
	function renderCharDropdown(vbar, d, query) {
		var old = vbar.querySelector(".om-char-dropdown");
		if (old) old.parentNode.removeChild(old);
		var favs = d.charFavorites || [];
		var groups = d.charGroups || {};
		var allNames = d.charNames || [];
		var matchedGroupKeys = {};
		if (query) {
			for (var gg in groups) if (gg.toLowerCase().indexOf(query) !== -1) matchedGroupKeys[gg] = true;
		}
		function visible(cn) {
			if (!query) return true;
			if (cn.toLowerCase().indexOf(query) !== -1) return true;
			for (var gg2 in matchedGroupKeys) if ((groups[gg2] || []).indexOf(cn) !== -1) return true;
			return false;
		}
		var inGroup = {};
		for (var gn in groups) (groups[gn] || []).forEach(function(n) {
			inGroup[n] = true;
		});
		function makeRow(cn) {
			if (!visible(cn)) return "";
			var isFav = favs.indexOf(cn) !== -1;
			var isActive = d.currentChar === cn;
			var count = ((d.chars && d.chars[cn] ? d.chars[cn] : { outfits: [] }).outfits || []).length;
			return "<div class=\"om-char-row" + (isActive ? " active" : "") + "\" data-cn=\"" + esc$2(cn) + "\"><i class=\"fa-" + (isFav ? "solid" : "regular") + " fa-star om-char-star" + (isFav ? " on" : "") + "\" data-cn=\"" + esc$2(cn) + "\"></i><span class=\"om-char-rname\">" + esc$2(cn) + "</span><span class=\"om-char-count\">" + count + "套</span><div class=\"om-char-actions\"><button class=\"om-char-act om-char-rename\" data-cn=\"" + esc$2(cn) + "\" title=\"重命名\"><i class=\"fa-solid fa-pen\"></i></button><button class=\"om-char-act om-char-move-group\" data-cn=\"" + esc$2(cn) + "\" title=\"分组\"><i class=\"fa-solid fa-folder\"></i></button><button class=\"om-char-act om-char-delete\" data-cn=\"" + esc$2(cn) + "\" title=\"删除\" style=\"color:#e57373\"><i class=\"fa-solid fa-trash\"></i></button></div></div>";
		}
		function makeSection(title, iconClass, names, gkey) {
			var visNames = names.filter(visible);
			if (visNames.length === 0) return "";
			var isCollapsed = collapsedGroups[gkey];
			var html = "<div class=\"om-char-group-hdr\" data-gkey=\"" + esc$2(gkey) + "\"><i class=\"fa-solid fa-chevron-down om-g-arrow" + (isCollapsed ? " collapsed" : "") + "\"></i><i class=\"" + iconClass + " om-g-icon\"></i> " + esc$2(title) + " <span style=\"opacity:.4\">(" + visNames.length + ")</span></div>";
			if (!isCollapsed) visNames.forEach(function(cn) {
				html += makeRow(cn);
			});
			return html;
		}
		var listHtml = "";
		var favNames = allNames.filter(function(n) {
			return favs.indexOf(n) !== -1;
		});
		listHtml += makeSection("收藏", "fa-solid fa-star", favNames, "__fav__");
		for (var gn2 in groups) {
			var gNames = (groups[gn2] || []).filter(function(n) {
				return allNames.indexOf(n) !== -1;
			});
			listHtml += makeSection(gn2, "fa-solid fa-folder", gNames, "g_" + gn2);
		}
		var ungrouped = allNames.filter(function(n) {
			return !inGroup[n] && favs.indexOf(n) === -1;
		});
		if (ungrouped.length > 0) {
			var ugLabel = favNames.length > 0 || Object.keys(groups).length > 0 ? "未分组" : "全部角色";
			listHtml += makeSection(ugLabel, "fa-regular fa-folder-open", ungrouped, "__ungrouped__");
		}
		if (allNames.length === 0) listHtml = "<div class=\"om-char-empty\">还没有角色，点 + 添加</div>";
		var dropdown = document.createElement("div");
		dropdown.className = "om-char-dropdown";
		dropdown.innerHTML = listHtml;
		vbar.appendChild(dropdown);
		dropdown.querySelectorAll(".om-char-group-hdr").forEach(function(hdr) {
			hdr.addEventListener("click", function() {
				collapsedGroups[hdr.dataset.gkey] = !collapsedGroups[hdr.dataset.gkey];
				renderCharDropdown(vbar, load$1(), query);
			});
		});
		dropdown.querySelectorAll(".om-char-row").forEach(function(row) {
			row.addEventListener("click", function(e) {
				if (e.target.closest(".om-char-star") || e.target.closest(".om-char-actions")) return;
				var dd = load$1();
				dd.currentChar = row.dataset.cn;
				save$1(dd);
				charPanelExpanded = false;
				renderViewbar();
				renderCatbar();
				renderGrid$1();
				renderBottomStatus$1();
			});
		});
		dropdown.querySelectorAll(".om-char-star").forEach(function(star) {
			star.addEventListener("click", function(e) {
				e.stopPropagation();
				var dd = load$1();
				if (!dd.charFavorites) dd.charFavorites = [];
				var cn = star.dataset.cn;
				var idx = dd.charFavorites.indexOf(cn);
				if (idx !== -1) dd.charFavorites.splice(idx, 1);
				else dd.charFavorites.push(cn);
				save$1(dd);
				renderCharDropdown(vbar, load$1(), query);
			});
		});
		dropdown.querySelectorAll(".om-char-rename").forEach(function(btn) {
			btn.addEventListener("click", function(e) {
				e.stopPropagation();
				var cn = btn.dataset.cn;
				var nw = prompt("重命名角色「" + cn + "」：", cn);
				if (!nw || !nw.trim() || nw.trim() === cn) return;
				nw = nw.trim();
				var dd = load$1();
				if (dd.charNames.indexOf(nw) !== -1) {
					toast$1("角色「" + nw + "」已存在", true);
					return;
				}
				var idx = dd.charNames.indexOf(cn);
				if (idx !== -1) dd.charNames[idx] = nw;
				if (dd.chars && dd.chars[cn]) {
					dd.chars[nw] = dd.chars[cn];
					delete dd.chars[cn];
				}
				if (dd.charFavorites) {
					var fi = dd.charFavorites.indexOf(cn);
					if (fi !== -1) dd.charFavorites[fi] = nw;
				}
				if (dd.charGroups) for (var g in dd.charGroups) {
					var gi = dd.charGroups[g].indexOf(cn);
					if (gi !== -1) dd.charGroups[g][gi] = nw;
				}
				if (dd.currentChar === cn) dd.currentChar = nw;
				save$1(dd);
				renderViewbar();
				renderCatbar();
				renderGrid$1();
				toast$1("已重命名为「" + nw + "」");
			});
		});
		dropdown.querySelectorAll(".om-char-move-group").forEach(function(btn) {
			btn.addEventListener("click", function(e) {
				e.stopPropagation();
				var cn = btn.dataset.cn;
				var dd = load$1();
				if (!dd.charGroups) dd.charGroups = {};
				var gNamesList = Object.keys(dd.charGroups);
				if (gNamesList.length === 0) {
					var gname = prompt("还没有分组，输入新分组名称：");
					if (!gname || !gname.trim()) return;
					dd.charGroups[gname.trim()] = [cn];
					save$1(dd);
					renderCharDropdown(vbar, load$1(), query);
					toast$1("已创建分组并移入");
					return;
				}
				var currentGroup = "";
				for (var g in dd.charGroups) if ((dd.charGroups[g] || []).indexOf(cn) !== -1) {
					currentGroup = g;
					break;
				}
				var msg = "将「" + cn + "」移到：\n0. 不分组" + (currentGroup ? "（当前：" + currentGroup + "）" : "") + "\n";
				gNamesList.forEach(function(g, i) {
					msg += i + 1 + ". " + g + "\n";
				});
				msg += gNamesList.length + 1 + ". 新建分组";
				var choice = prompt(msg);
				if (choice === null) return;
				var ci = parseInt(choice);
				for (var g2 in dd.charGroups) {
					var ri = dd.charGroups[g2].indexOf(cn);
					if (ri !== -1) dd.charGroups[g2].splice(ri, 1);
				}
				if (ci > 0 && ci <= gNamesList.length) {
					dd.charGroups[gNamesList[ci - 1]].push(cn);
					toast$1("已移入「" + gNamesList[ci - 1] + "」");
				} else if (ci === gNamesList.length + 1) {
					var ng = prompt("新分组名称：");
					if (ng && ng.trim()) {
						dd.charGroups[ng.trim()] = [cn];
						toast$1("已创建分组并移入");
					}
				} else toast$1("已移出分组");
				save$1(dd);
				renderCharDropdown(vbar, load$1(), query);
			});
		});
		dropdown.querySelectorAll(".om-char-delete").forEach(function(btn) {
			btn.addEventListener("click", function(e) {
				e.stopPropagation();
				var cn = btn.dataset.cn;
				if (!confirm("删除角色「" + cn + "」及其所有穿搭？")) return;
				var dd = load$1();
				if (dd.chars) delete dd.chars[cn];
				var idx = dd.charNames.indexOf(cn);
				if (idx !== -1) dd.charNames.splice(idx, 1);
				if (dd.charFavorites) {
					var fi = dd.charFavorites.indexOf(cn);
					if (fi !== -1) dd.charFavorites.splice(fi, 1);
				}
				if (dd.charGroups) for (var g in dd.charGroups) {
					var gi = dd.charGroups[g].indexOf(cn);
					if (gi !== -1) dd.charGroups[g].splice(gi, 1);
				}
				if (dd.currentChar === cn) dd.currentChar = "";
				save$1(dd);
				renderViewbar();
				renderCatbar();
				renderGrid$1();
				renderBottomStatus$1();
				toast$1("已删除角色「" + cn + "」");
			});
		});
		function closeOnOutside(e) {
			if (!vbar.contains(e.target)) {
				charPanelExpanded = false;
				var dd2 = vbar.querySelector(".om-char-dropdown");
				if (dd2) dd2.parentNode.removeChild(dd2);
				document.removeEventListener("click", closeOnOutside, true);
			}
		}
		setTimeout(function() {
			document.addEventListener("click", closeOnOutside, true);
		}, 50);
	}
	function addCharPrompt() {
		var name = prompt("输入角色名：");
		if (!name || !name.trim()) return;
		name = name.trim();
		var dd = load$1();
		if (!dd.charNames) dd.charNames = [];
		if (dd.charNames.indexOf(name) !== -1) {
			toast$1("角色「" + name + "」已存在", true);
			return;
		}
		dd.charNames.push(name);
		dd.currentChar = name;
		save$1(dd);
		charPanelExpanded = false;
		renderViewbar();
		renderCatbar();
		renderGrid$1();
		renderBottomStatus$1();
		toast$1("✅ 已添加角色「" + name + "」");
	}
	function renderCatbar() {
		var catbar = document.getElementById("om-catbar");
		if (!catbar) return;
		var d = load$1();
		var cats = getViewCategories(d);
		var allOutfits = getViewOutfits(d);
		var outfitCats = {};
		var itemCats = {};
		allOutfits.forEach(function(o) {
			var c = o.category || "";
			if (!o.type || o.type === "outfit") {
				if (c) outfitCats[c] = true;
			} else if (c) itemCats[c] = true;
		});
		if (cats.length === 0) {
			catbar.style.display = "none";
			return;
		}
		catbar.style.display = "";
		var html = "<button class=\"om-catbtn om-typebtn\"" + (curType === "__all__" ? " on" : "") + " data-t=\"__all__\">全部</button>";
		html += "<button class=\"om-catbtn om-typebtn\"" + (curType === "outfit" ? " on" : "") + " data-t=\"outfit\"><i class=\"fa-solid fa-shirt\"></i> 套装</button>";
		html += "<button class=\"om-catbtn om-typebtn\"" + (curType === "item" ? " on" : "") + " data-t=\"item\"><i class=\"fa-solid fa-box\"></i> 单品</button>";
		html += "<span style=\"width:1px;height:20px;background:rgba(127,127,127,.2);flex-shrink:0;margin:0 2px;align-self:center\"></span>";
		cats.forEach(function(c) {
			var show = true;
			if (curType === "outfit" && !outfitCats[c]) show = false;
			if (curType === "item" && !itemCats[c]) show = false;
			if (show) html += "<button class=\"om-catbtn\"" + (curCat === c ? " on" : "") + " data-c=\"" + esc$2(c) + "\">" + esc$2(c) + "</button>";
		});
		catbar.innerHTML = html;
		catbar.querySelectorAll(".om-typebtn").forEach(function(btn) {
			btn.addEventListener("click", function() {
				curType = btn.dataset.t;
				curCat = "__all__";
				renderCatbar();
				renderGrid$1();
			});
		});
		catbar.querySelectorAll(".om-catbtn:not(.om-typebtn)").forEach(function(btn) {
			btn.addEventListener("click", function() {
				curCat = btn.dataset.c;
				renderCatbar();
				renderGrid$1();
			});
		});
		if (!catbar._wheelBound) {
			catbar.addEventListener("wheel", function(e) {
				if (Math.abs(e.deltaY) > 0) {
					e.preventDefault();
					catbar.scrollLeft += e.deltaY;
				}
			}, { passive: false });
			var _drag = {
				down: false,
				startX: 0,
				scrollL: 0
			};
			catbar.addEventListener("mousedown", function(e) {
				_drag.down = true;
				_drag.startX = e.pageX;
				_drag.scrollL = catbar.scrollLeft;
				catbar.style.cursor = "grabbing";
				catbar.style.userSelect = "none";
			});
			document.addEventListener("mousemove", function(e) {
				if (!_drag.down) return;
				catbar.scrollLeft = _drag.scrollL - (e.pageX - _drag.startX);
			});
			document.addEventListener("mouseup", function() {
				if (_drag.down) {
					_drag.down = false;
					catbar.style.cursor = "";
					catbar.style.userSelect = "";
				}
			});
			catbar._wheelBound = true;
		}
	}
	function renderGrid$1() {
		var area = document.getElementById("om-grid-area");
		if (!area) return;
		var d = load$1();
		if (d.currentView === "char" && !d.currentChar) {
			area.innerHTML = "<div class=\"om-empty\"><i class=\"fa-solid fa-masks-theater\"></i><span>请先选择或添加一个角色</span></div>";
			return;
		}
		var allOutfits = getViewOutfits(d);
		var list = curCat === "__all__" ? allOutfits : allOutfits.filter(function(o) {
			return o.category === curCat;
		});
		if (curType !== "__all__") list = list.filter(function(o) {
			return curType === "outfit" ? !o.type || o.type === "outfit" : o.type === "item";
		});
		if (searchQuery) {
			var q = searchQuery.toLowerCase();
			list = list.filter(function(o) {
				return o.name && o.name.toLowerCase().indexOf(q) !== -1 || o.category && o.category.toLowerCase().indexOf(q) !== -1 || o.sceneTag && o.sceneTag.toLowerCase().indexOf(q) !== -1 || o.description && o.description.toLowerCase().indexOf(q) !== -1;
			});
		}
		var imgOutfits = list.filter(function(o) {
			return hasImages(o);
		});
		var html = "";
		if (batchMode) html += "<div class=\"om-batch-bar\"><span class=\"om-batch-info\">已选&nbsp;<b id=\"om-batch-count\">" + batchSelected.length + "</b>&nbsp;套</span><div class=\"om-batch-divider\" style=\"width:1px;height:16px;background:rgba(127,127,127,.25);flex-shrink:0;margin:0 2px;\"></div><div class=\"om-batch-acts\"><button class=\"om-batch-btn\" id=\"om-batch-selall\">全选</button><button class=\"om-batch-btn\" id=\"om-batch-none\">取消</button><button class=\"om-batch-btn\" id=\"om-batch-cat\"><i class=\"fa-solid fa-folder\"></i> 分类</button><button class=\"om-batch-btn\" id=\"om-batch-tag\"><i class=\"fa-solid fa-tag\"></i> 标签</button><button class=\"om-batch-btn\" id=\"om-batch-aidesc\"><i class=\"fa-solid fa-wand-magic-sparkles\"></i> AI描述</button><button class=\"om-batch-btn\" id=\"om-batch-paste\"><i class=\"fa-solid fa-paste\"></i> 批量粘贴</button><button class=\"om-batch-btn\" id=\"om-batch-parse\"><i class=\"fa-solid fa-list-check\"></i> 单品解析</button><button class=\"om-batch-btn\" id=\"om-batch-autotag\"><i class=\"fa-solid fa-wand-magic-sparkles\"></i> 一键识别</button><button class=\"om-batch-btn danger\" id=\"om-batch-del\"><i class=\"fa-solid fa-trash\"></i> 删除</button></div></div>";
		html += "<div class=\"om-grid\">";
		if (!batchMode) {
			html += "<div class=\"om-add-card\" id=\"om-addcard\"><i class=\"fa-solid fa-plus\"></i><span>添加穿搭</span></div>";
			html += "<div class=\"om-batch-add-card\" id=\"om-batchaddcard\"><i class=\"fa-solid fa-images\"></i><span>批量添加</span></div>";
		}
		if (wbMode && curCat !== "__all__") getWorldBookStyles().filter(function(ws) {
			return ws.scene === curCat || ws.style === curCat;
		}).forEach(function(ws, wi) {
			list.push({
				id: "wb_grid_" + wi,
				name: ws.name,
				category: curCat,
				type: "outfit",
				style: ws.style,
				season: ws.season,
				sceneTag: ws.scene,
				description: ws.desc,
				images: [],
				isVirtual: true
			});
		});
		if (list.length === 0) html += "</div><div class=\"om-empty\"><i class=\"fa-solid fa-shirt\"></i><span>" + (searchQuery ? "没有匹配「" + esc$2(searchQuery) + "」的穿搭" : curCat !== "__all__" ? "该分类暂无穿搭" : "还没有穿搭，点击左上角添加") + "</span></div>";
		else {
			list.forEach(function(o) {
				var on = isActive(d, o.id);
				var bsel = batchSelected.indexOf(o.id) !== -1;
				var checkBox = batchMode ? "<div class=\"om-card-check" + (bsel ? " checked" : "") + "\" data-id=\"" + o.id + "\"><i class=\"fa-solid fa-check\"></i></div>" : "";
				var badge = on && !batchMode ? "<div class=\"om-badge-on\"><i class=\"fa-solid fa-check\"></i></div>" : "";
				var imgContent = "";
				if (hasImages(o)) imgContent = "<img src=\"" + getFirstImage(o) + "\" alt=\"" + esc$2(o.name) + "\" />";
				else {
					var descPreview = o.description && o.description.trim() ? o.description.trim() : "";
					imgContent = "<div class=\"om-card-noimg\"><div class=\"om-noimg-name\">" + esc$2(o.name) + "</div>" + (descPreview ? "<div class=\"om-noimg-desc\">" + esc$2(descPreview) + "</div>" : "") + "<i class=\"fa-regular fa-file-lines om-noimg-icon\"></i></div>";
				}
				var menuBtn = batchMode ? "" : "<button class=\"om-card-menu\" data-id=\"" + o.id + "\" title=\"操作\"><i class=\"fa-solid fa-ellipsis-vertical\"></i></button>";
				var tagText = o.sceneTag && o.sceneTag.trim() ? o.sceneTag.trim() : "";
				html += "<div class=\"om-card" + (on ? " on" : "") + (bsel ? " batch-sel" : "") + (hasImages(o) ? "" : " no-img") + "\" data-id=\"" + o.id + "\"><div class=\"om-card-img\">" + checkBox + imgContent + badge + menuBtn + "</div><div class=\"om-card-info\"><div class=\"om-card-name\">" + esc$2(o.name) + "</div>" + (tagText ? "<div class=\"om-card-tag\">" + esc$2(tagText) + "</div>" : "") + "</div></div>";
			});
			html += "</div>";
		}
		area.innerHTML = html;
		var ac = area.querySelector("#om-addcard");
		if (ac) ac.addEventListener("click", function() {
			openEditSheet(null, curCat !== "__all__" ? curCat : "");
		});
		var bac = area.querySelector("#om-batchaddcard");
		if (bac) bac.addEventListener("click", function() {
			openBatchAddSheet(curCat !== "__all__" ? curCat : "");
		});
		if (batchMode) {
			var selall = area.querySelector("#om-batch-selall");
			var selnone = area.querySelector("#om-batch-none");
			var btagBtn = area.querySelector("#om-batch-tag");
			var bdelBtn = area.querySelector("#om-batch-del");
			if (selall) selall.addEventListener("click", function() {
				batchSelected = list.map(function(o) {
					return o.id;
				});
				renderGrid$1();
			});
			if (selnone) selnone.addEventListener("click", function() {
				batchSelected = [];
				renderGrid$1();
			});
			var bcatBtn = area.querySelector("#om-batch-cat");
			if (bcatBtn) bcatBtn.addEventListener("click", function() {
				if (batchSelected.length === 0) {
					toast$1("请先选择穿搭", true);
					return;
				}
				var dd = load$1();
				var cats = getViewCategories(dd);
				if (cats.length === 0) {
					toast$1("还没有分类，请先在设置中添加", true);
					return;
				}
				var msg = "选择分类（输入序号）：\n" + cats.map(function(n, i) {
					return i + 1 + ". " + n;
				}).join("\n");
				var choice = prompt(msg);
				if (choice === null) return;
				var ci = parseInt(choice) - 1;
				if (ci < 0 || ci >= cats.length) {
					toast$1("无效选择", true);
					return;
				}
				var targetCat = cats[ci];
				dd.outfits.forEach(function(o) {
					if (batchSelected.indexOf(o.id) !== -1) o.category = targetCat;
				});
				save$1(dd);
				toast$1("✅ 已将 " + batchSelected.length + " 套移到「" + targetCat + "」");
				batchSelected = [];
				renderGrid$1();
			});
			if (btagBtn) btagBtn.addEventListener("click", function() {
				if (batchSelected.length === 0) {
					toast$1("请先选择穿搭", true);
					return;
				}
				var tag = prompt("为所选 " + batchSelected.length + " 套穿搭设置场景标签：");
				if (tag === null) return;
				tag = tag.trim();
				var dd = load$1();
				dd.outfits.forEach(function(o) {
					if (batchSelected.indexOf(o.id) !== -1) o.sceneTag = tag;
				});
				save$1(dd);
				toast$1("✅ 已设置标签：" + (tag || "（已清空）"));
				batchSelected = [];
				renderGrid$1();
			});
			if (bdelBtn) bdelBtn.addEventListener("click", function() {
				if (batchSelected.length === 0) {
					toast$1("请先选择穿搭", true);
					return;
				}
				if (!confirm("确定删除已选 " + batchSelected.length + " 套穿搭？")) return;
				var dd = load$1();
				dd.outfits = dd.outfits.filter(function(o) {
					return batchSelected.indexOf(o.id) === -1;
				});
				if (dd.chars) for (var cn in dd.chars) dd.chars[cn].outfits = (dd.chars[cn].outfits || []).filter(function(o) {
					return batchSelected.indexOf(o.id) === -1;
				});
				batchSelected.forEach(function(id) {
					var ai = (dd.activeIds || []).indexOf(id);
					if (ai !== -1) dd.activeIds.splice(ai, 1);
					if (dd.chars) for (var cn2 in dd.chars) {
						var cai = (dd.chars[cn2].activeIds || []).indexOf(id);
						if (cai !== -1) dd.chars[cn2].activeIds.splice(cai, 1);
					}
				});
				save$1(dd);
				updateBtn$1();
				renderBottomStatus$1();
				toast$1("已删除 " + batchSelected.length + " 套穿搭");
				batchSelected = [];
				renderGrid$1();
			});
			var bpasteBtn = area.querySelector("#om-batch-paste");
			if (bpasteBtn) bpasteBtn.addEventListener("click", function() {
				if (batchSelected.length === 0) {
					toast$1("请先选择穿搭", true);
					return;
				}
				var darkMode = getDarkMode();
				var modal = document.createElement("div");
				modal.className = "om-modal";
				var bg = darkMode ? "#1e1e24" : "#ececef";
				var fg = darkMode ? "#eee" : "#111";
				modal.innerHTML = "<div class=\"om-modal-box\" style=\"max-width:600px;background:" + bg + ";color:" + fg + "\"><div class=\"om-modal-title\"><i class=\"fa-solid fa-paste\"></i> 批量粘贴描述</div><div style=\"font-size:.78em;opacity:.6;margin-bottom:8px\">将 AI 返回的所有描述一起粘贴到下方，按 <code>--- 第N套 ---</code> 自动分割分配给已选 " + batchSelected.length + " 套穿搭</div><textarea id=\"om-paste-area\" rows=\"14\" style=\"width:100%;background:rgba(127,127,127,.08);border:1px solid rgba(127,127,127,.2);border-radius:8px;color:inherit;padding:10px;font-size:.85em;resize:vertical;font-family:inherit;box-sizing:border-box\"></textarea><div id=\"om-paste-result\" style=\"margin-top:8px;font-size:.8em\"></div><div class=\"om-btn-row\" style=\"margin-top:10px\"><button class=\"om-btn om-btn-safe\" id=\"om-paste-go\">分配并保存</button><button class=\"om-btn om-btn-outline\" id=\"om-paste-copyprompt\" style=\"font-size:.75em;padding:3px 8px;margin-right:4px\"><i class=\"fa-solid fa-copy\"></i> 复制提示词</button><button class=\"om-btn om-btn-outline\" id=\"om-paste-cancel\">取消</button></div></div>";
				var mp = getPopupLayer$1();
				modal.style.cssText = "position:absolute !important;inset:0 !important;z-index:1 !important;background:rgba(0,0,0,.45) !important;display:flex !important;align-items:center !important;justify-content:center !important;padding:20px !important;box-sizing:border-box !important;pointer-events:auto !important;";
				mp.appendChild(modal);
				modal.addEventListener("click", function(e) {
					if (e.target === modal) mp.removeChild(modal);
				});
				modal.querySelector("#om-paste-cancel").addEventListener("click", function() {
					mp.removeChild(modal);
				});
				modal.querySelector("#om-paste-copyprompt").addEventListener("click", function(e) {
					e.stopPropagation();
					navigator.clipboard.writeText("请逐一分析以下穿搭照片，对每张照片严格按以下格式返回（不要额外解释，直接输出）：\n\n--- 第1套 ---\n名称：<5-15字简短名称>\n分类：<睡衣/制服/常服/外出服>\n风格：<学院/简约/运动/甜美/通勤/休闲/街头/优雅/舒适>\n季节：<春/夏/秋/冬/全年>\n场景：<外出/家居/办公/约会/运动/睡前>\n描述：<100-200字服装描述>\n\n--- 第2套 ---\n...").then(function() {
						toast$1("提示词已复制！粘贴到外部AI对话框即可");
					}).catch(function() {
						toast$1("复制失败，请手动复制", true);
					});
				});
				modal.querySelector("#om-paste-go").addEventListener("click", function() {
					var text = modal.querySelector("#om-paste-area").value.trim();
					if (!text) {
						toast$1("请先粘贴内容", true);
						return;
					}
					var blocks = text.split(/---\s*第\s*\d+\s*套\s*---/i).filter(function(b) {
						return b.trim();
					});
					if (blocks.length === 0) blocks = text.split(/\n\s*\n\s*\n/).filter(function(b) {
						return b.trim();
					});
					if (blocks.length === 0) blocks = [text];
					var dd = load$1();
					var updated = 0;
					var ids = batchSelected.slice();
					for (var i = 0; i < Math.min(blocks.length, ids.length); i++) {
						var o = getById(dd, ids[i]);
						if (!o) continue;
						var block = blocks[i].trim();
						function findKey(kp) {
							var stopPat = [
								"名称",
								"分类",
								"类型",
								"风格",
								"季节",
								"场景",
								"描述"
							].filter(function(k) {
								return k !== kp;
							}).map(function(k) {
								return k + "\\s*[\\uff1a：]";
							}).join("|");
							var m = block.match(new RegExp(kp + "\\s*[\\uff1a：]\\s*([\\s\\S]*?)(?=" + stopPat + "|---|$)", "i"));
							return m ? m[1].trim() : "";
						}
						var nm = findKey("名称");
						if (nm) o.name = nm;
						var cat = findKey("分类");
						if (cat) {
							o.category = cat;
							var vcl = getViewCategories(dd);
							if (vcl.indexOf(cat) === -1) vcl.push(cat);
						}
						var st = findKey("风格");
						if (st) o.style = st;
						var sn = findKey("季节");
						if (sn) o.season = sn;
						var sc = findKey("场景");
						if (sc) o.sceneTag = sc;
						var desc = findKey("描述");
						if (desc) o.description = desc;
						if (!nm && !cat && !st && !sn && !sc && !desc) o.description = block;
						updated++;
					}
					save$1(dd);
					mp.removeChild(modal);
					renderGrid$1();
					renderCatbar();
					toast$1("✅ 已更新 " + updated + " 套");
				});
			});
			var bparseBtn2 = area.querySelector("#om-batch-parse");
			if (bparseBtn2) bparseBtn2.addEventListener("click", function() {
				if (batchSelected.length === 0) {
					toast$1("请先选择穿搭", true);
					return;
				}
				var ddx = load$1();
				if (!ddx.apiVision.endpoint || !ddx.apiVision.key || !ddx.apiVision.model) {
					toast$1("请先配置 API", true);
					return;
				}
				openBatchParseModal(batchSelected.slice());
			});
			var bautotagBtn2 = area.querySelector("#om-batch-autotag");
			if (bautotagBtn2) bautotagBtn2.addEventListener("click", function() {
				if (batchSelected.length === 0) {
					toast$1("请先选择穿搭", true);
					return;
				}
				var ddx2 = load$1();
				if (!ddx2.apiVision.endpoint || !ddx2.apiVision.key || !ddx2.apiVision.model) {
					toast$1("请先配置 API", true);
					return;
				}
				openBatchAutoTagModal(batchSelected.slice());
			});
			var baidescBtn = area.querySelector("#om-batch-aidesc");
			if (baidescBtn) baidescBtn.addEventListener("click", function() {
				if (batchSelected.length === 0) {
					toast$1("请先选择穿搭", true);
					return;
				}
				var dd = load$1();
				if (!dd.apiVision.endpoint || !dd.apiVision.key || !dd.apiVision.model) {
					toast$1("请先在设置中配置\"描述生成 API\"", true);
					return;
				}
				if (!batchSelected.some(function(id) {
					var o = getById(dd, id);
					return o && hasImages(o);
				})) {
					toast$1("所选穿搭中没有带图片的", true);
					return;
				}
				openBatchDescModal(batchSelected.slice());
			});
			area.querySelectorAll(".om-card").forEach(function(card) {
				card.addEventListener("click", function(e) {
					if (e.target.closest(".om-card-check")) return;
					var id = card.dataset.id;
					var chk = card.querySelector(".om-card-check");
					var idx = batchSelected.indexOf(id);
					if (idx !== -1) batchSelected.splice(idx, 1);
					else batchSelected.push(id);
					if (chk) chk.classList.toggle("checked", batchSelected.indexOf(id) !== -1);
					card.classList.toggle("batch-sel", batchSelected.indexOf(id) !== -1);
					var cnt = area.querySelector("#om-batch-count");
					if (cnt) cnt.textContent = batchSelected.length;
				});
			});
			area.querySelectorAll(".om-card-check").forEach(function(chk) {
				chk.addEventListener("click", function(e) {
					e.stopPropagation();
					var id = chk.dataset.id;
					var idx = batchSelected.indexOf(id);
					if (idx !== -1) batchSelected.splice(idx, 1);
					else batchSelected.push(id);
					chk.classList.toggle("checked", batchSelected.indexOf(id) !== -1);
					var card = chk.closest(".om-card");
					if (card) card.classList.toggle("batch-sel", batchSelected.indexOf(id) !== -1);
					var cnt = area.querySelector("#om-batch-count");
					if (cnt) cnt.textContent = batchSelected.length;
				});
			});
		} else {
			area.querySelectorAll(".om-card").forEach(function(card) {
				var id = card.dataset.id;
				card.addEventListener("click", function(e) {
					if (e.target.closest(".om-card-menu") || e.target.closest(".om-badge-on")) return;
					var dd = load$1();
					var aids = getViewActiveIds(dd);
					var idx = aids.indexOf(id);
					if (idx !== -1) aids.splice(idx, 1);
					else aids.push(id);
					setViewActiveIds(dd, aids);
					save$1(dd);
					updateBtn$1();
					renderBottomStatus$1();
					card.classList.toggle("on", isActive(dd, id));
					var badge = card.querySelector(".om-badge-on");
					if (isActive(dd, id)) {
						if (!badge) {
							var b = document.createElement("div");
							b.className = "om-badge-on";
							b.innerHTML = "<i class=\"fa-solid fa-check\"></i>";
							card.querySelector(".om-card-img").appendChild(b);
						}
					} else if (badge) badge.parentNode.removeChild(badge);
					closeDetailPanel$1();
					var n = aids.length;
					var o = getById(dd, id);
					if (idx !== -1) toast$1("已取消：" + (o ? o.name : ""));
					else if (n === 1) toast$1("✅ 已选：" + (o ? o.name : ""));
					else toast$1("✅ 衣柜模式，共" + n + "套");
				});
			});
			area.querySelectorAll(".om-card-menu").forEach(function(btn) {
				btn.addEventListener("click", function(e) {
					e.stopPropagation();
					var id = btn.dataset.id;
					openContextMenu(getById(load$1(), id), imgOutfits);
				});
			});
		}
	}
	//#endregion
	//#region src/ui/ui-bar.js
	function updateBtn$1() {
		var btn = document.getElementById(BTN_ID);
		if (!btn) return;
		var d = load$1();
		var names = [];
		d.activeIds.forEach(function(id) {
			var o = getById(d, id);
			if (o) names.push(o.name);
		});
		var span = btn.querySelector("span");
		if (span) if (names.length === 0) span.textContent = SCRIPT_NAME;
		else if (names.length === 1) span.textContent = names[0];
		else span.textContent = "衣柜(" + names.length + "套)";
		btn.style.color = names.length > 0 ? "var(--SmartThemeQuoteColor)" : "";
	}
	function findMenu() {
		var m = document.getElementById("extensionsMenu");
		if (m) return m;
		m = document.getElementById("extensions_menu");
		if (m) return m;
		var items = document.querySelectorAll(".list-group-item.interactable");
		for (var i = 0; i < items.length; i++) {
			var t = items[i].textContent || "";
			if (t.indexOf("CSS") !== -1 || t.indexOf("头像框") !== -1 || t.indexOf("变量管理") !== -1) return items[i].parentElement;
		}
		return null;
	}
	function injectBtn() {
		if (document.getElementById("outfit-mgr-ext-btn-v4")) return;
		var menu = findMenu();
		if (!menu) return;
		var d = load$1();
		var names = [];
		d.activeIds.forEach(function(id) {
			var o = getById(d, id);
			if (o) names.push(o.name);
		});
		var btn = document.createElement("div");
		btn.id = BTN_ID;
		btn.className = "list-group-item flex-container flexGap5 interactable";
		btn.title = SCRIPT_NAME;
		if (names.length > 0) btn.style.color = "var(--SmartThemeQuoteColor)";
		btn.innerHTML = "<i class=\"fa-solid fa-shirt\"></i><span>" + esc$2(names.length === 1 ? names[0] : names.length > 1 ? "衣柜(" + names.length + "套)" : SCRIPT_NAME) + "</span>";
		btn.addEventListener("click", openPopup);
		menu.appendChild(btn);
	}
	//#endregion
	//#region src/index.js
	injectStyles();
	setupInjection();
	setTimeout(injectBtn, 500);
	setInterval(injectBtn, 2e3);
	setTimeout(injectFab, 1500);
	setInterval(function() {
		if (!document.getElementById("om-fab-main")) injectFab();
	}, 3e3);
	loadFromDB(function(dd) {
		if (dd.useMainApi) autoDetectApiConfig(dd);
		var ctx = getSTContextSafe();
		if (ctx) {
			var selNames = getSelectedWorldBookNames(ctx, dd);
			if (selNames.length > 0 && (!dd.selectedWorldBookNames || dd.selectedWorldBookNames.length === 0)) {
				dd.selectedWorldBookNames = selNames;
				save$1(dd);
			}
		}
		if ((!dd.activeIds || dd.activeIds.length === 0) && !dd.autoRollDisabled && dd.selectedWorldBookNames.length > 0) {
			var startupCtx = getSTContextSafe();
			var startupWBNames = dd.selectedWorldBookNames.slice();
			var startupWB = startupWBNames[Math.floor(Math.random() * startupWBNames.length)];
			loadWorldBookByName(startupCtx, startupWB).then(function(data) {
				var disabledEntries = getAllDisabledEntries(data, startupWB);
				if (disabledEntries.length === 0) return;
				var pickedEntry = disabledEntries[Math.floor(Math.random() * disabledEntries.length)];
				return enableWorldBookEntry(startupCtx, startupWB, pickedEntry.id).then(function(enabledEntry) {
					if (!enabledEntry) return;
					dd = load();
					dd.lastAutoEnabledEntry = {
						wbName: startupWB,
						entryId: pickedEntry.id
					};
					var entryName = pickedEntry.comment || (Array.isArray(pickedEntry.key) ? pickedEntry.key.join(", ") : pickedEntry.key || "世界书穿搭");
					var virtual = {
						id: "wb_entry_" + pickedEntry.id + "_" + Date.now(),
						name: entryName,
						category: "世界书",
						type: "outfit",
						style: "",
						season: "",
						sceneTag: "",
						description: pickedEntry.content || "",
						images: [],
						isVirtual: true,
						source: startupWB
					};
					dd.virtualOutfits[virtual.id] = virtual;
					dd.activeIds = [virtual.id];
					save$1(dd);
					setTimeout(function() {
						toast$1("今日穿搭：「" + entryName + "」（来自 " + startupWB + "）");
					}, 3500);
				});
			}).catch(function() {
				refreshWorldBookStyles(dd.selectedWorldBookNames, function() {
					var styles = getWorldBookStyles(dd.selectedWorldBookNames);
					if (styles.length > 0) {
						var pick = styles[Math.floor(Math.random() * styles.length)];
						var virtual = createWorldBookOutfit(pick, "wb", 0);
						dd.virtualOutfits[virtual.id] = virtual;
						dd.activeIds = [virtual.id];
						save$1(dd);
						setTimeout(function() {
							toast$1("今日穿搭：「" + virtual.name + "」（" + (pick.style || "") + "·" + (pick.scene || "") + "）");
						}, 3500);
					}
				});
			});
		} else if (dd.activeIds && dd.activeIds.length > 0) setTimeout(function() {
			var names = [];
			dd.activeIds.forEach(function(id) {
				var o = null;
				for (var i = 0; i < dd.outfits.length; i++) if (dd.outfits[i].id === id) {
					o = dd.outfits[i];
					break;
				}
				if (!o && dd.virtualOutfits && dd.virtualOutfits[id]) o = dd.virtualOutfits[id];
				if (o && o.name) names.push(o.name);
			});
			if (names.length > 0) toast$1("今日穿搭：「" + names.join("、") + "」");
		}, 3500);
		updateBtn$1();
	});
	//#endregion
})();
