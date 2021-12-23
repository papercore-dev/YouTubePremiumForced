/*
 *  I18n.js
 *  =======
 *
 *  Simple localization util.
 *  1. Store your localized labels in json format: `localized-content.json`
 *  2. Write your markup with key references using `data-i18n` attributes.
 *  3. Explicitly invoke a traverse key resolver: `i18n.localize()`
 *     OR
 *     Change the language, and the contents will be refreshed: `i18n.lang('en')`
 *
 *  This util relies on jQuery to work. I would recommend using the latest version
 *  available (1.12.x or 2.1.4+), although this will probably run with any older
 *  version since it is only taking advantage of `$.getJSON()` and the jQuery
 *  selector function `$()`.
 * 
 *  © 2016 Diogo Simões - diogosimoes.com
 *
 */

 var demoJson = {
	"demo": {
		"signin": {
			"en": "Sign In",
			"ko": "로그인"
		},
		"signup": {
			"en": "1 MONTH TRIAL",
			"ko": "1개월 무료체험"
		},
		"h01": {
			"en": "YouTube's free tier is",
			"ko": "YouTube의 프리 티어는"
		},
		"h02": {
			"en": "No longer available.",
			"ko": "더 이상 사용할 수 없습니다."
		},
		"prealert": {
			"en": "In January 2021, we announced that YouTube's free tier support would end in December 2021.",
			"ko": "지난 2021년 1월, YouTube의 무료 에디션 지원이 2021년 12월에 종료될 것이라고 공지했습니다."
		},
		"why01": {
			"en": "As part of YouTube's efforts to create a safe community of high-quality creators, we are ending support for YouTube for free users, and starting in June 2022, videos from creators not enrolled in Premium will be removed.",
			"ko": "수준 높은 크리에이터들로 이뤄진  안전한 커뮤니티를 만들기 위한 YouTube의 노력의 일환으로, 무료 사용자의 YouTube 지원을 종료하였으며, 2022년 6월부터 Premium에 등록되지 않은 크리에이터의 영상은 제거될 예정입니다."
		},
		"why02": {
			"en": "Existing data can be transferred to Vimeo, Facebook Live by pressing 'Sign In' at the top.",
			"ko": "기존 데이터는 상단의 '로그인'을 눌러 Vimeo, Facebook Live로 이전할 수 있습니다."
		},
		"monthly": {
			"en": "Monthly",
			"ko": "매월"
		},
		"yearly": {
			"en": "Yearly",
			"ko": "매년"
		},
		"save25": {
			"en": "SAVE 25%",
			"ko": "25% 절약"
		},
		"gpay": {
			"en": "PURCHASE",
			"ko": "로 결제"
		},
		"pay": {
			"en": "Buy",
			"ko": "구매"
		},
	}
};

(function () {
	this.I18n = function (defaultLang) {
		var lang = defaultLang || 'en';
		this.language = lang;

		(function (i18n) {
			i18n.contents = demoJson;
			i18n.contents.prop = function (key) {
				var result = this;
				var keyArr = key.split('.');
				for (var index = 0; index < keyArr.length; index++) {
					var prop = keyArr[index];
					result = result[prop];
				}
				return result;
			};
			i18n.localize();
		})(this);
	};

	this.I18n.prototype.hasCachedContents = function () {
		return this.contents !== undefined;
	};

	this.I18n.prototype.lang = function (lang) {
		if (typeof lang === 'string') {
			this.language = lang;
		}
		this.localize();
		return this.language;
	};

	this.I18n.prototype.localize = function () {
		var contents = this.contents;
		if (!this.hasCachedContents()) {
			return;
		}
		var dfs = function (node, keys, results) {
			var isLeaf = function (node) {
				for (var prop in node) {
					if (node.hasOwnProperty(prop)) {
						if (typeof node[prop] === 'string') {
							return true;
						}
					}
				}
			}
			for (var prop in node) {
				if (node.hasOwnProperty(prop) && typeof node[prop] === 'object') {
					var myKey = keys.slice();
					myKey.push(prop);
					if (isLeaf(node[prop])) {
						//results.push(myKey.reduce((prev, current) => prev + '.' + current));	//not supported in older mobile broweser
						results.push(myKey.reduce( function (previousValue, currentValue, currentIndex, array) {
							return previousValue + '.' + currentValue;
						}));
					} else {
						dfs(node[prop], myKey, results);
					}
				}
			}
			return results;
		};
		var keys = dfs(contents, [], []);
		for (var index = 0; index < keys.length; index++) {
			var key = keys[index];
			if (contents.prop(key).hasOwnProperty(this.language)) {
				$('[data-i18n="'+key+'"]').text(contents.prop(key)[this.language]);
				$('[data-i18n-placeholder="'+key+'"]').attr('placeholder', contents.prop(key)[this.language]);
				$('[data-i18n-value="'+key+'"]').attr('value', contents.prop(key)[this.language]);
			} else {
				$('[data-i18n="'+key+'"]').text(contents.prop(key)['en']);
				$('[data-i18n-placeholder="'+key+'"]').attr('placeholder', contents.prop(key)['en']);
				$('[data-i18n-value="'+key+'"]').attr('value', contents.prop(key)['en']);
			}
		}
	};

}).apply(window);

$( document ).ready( function () {
	const urlParams = new URLSearchParams(queryString);
	var i18n = new I18n();
	i18n.localize();
	if (urlParams.get('hl') == 'en'){
		i18n.lang('en');
	}
	else if (urlParams.get('hl') == 'ko'){
		i18n.lang('ko');
	}
	else{
		i18n.lang('ko');
	}
		selectLang($(this));
});