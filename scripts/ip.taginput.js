
$.fn.ip_TagInput = function (options) {

    var options = $.extend({
        tags: null, //string or []
        includeHashTag: true,
    }, options);

    var self = this;
    var ControlID = $(this).attr('id');
    var Controls = this;

    for (i = 0; i < Controls.length; i++) {

        var Control = Controls[i];
        var TagInput;
        var loadTags = null;
        var placeHolder = $(Control).attr('placeholder');

        if (typeof (options.tags) == 'string') { options.tags = options.tags.split(','); }
        if (options.tags != null) { loadTags = options.tags; options.tags = []; }
        else { options.tags = []; }

        if (placeHolder == undefined) { placeHolder = ''; }

        $(Control).html('');

        $(Control).append('<div class="ip_TagInput"><div contenteditable="true" tabindex="0" class="ip_TagInputTextBox" /><div class="ip_TagInputPlaceholder">' + placeHolder + '</div></div>');

        var TagInput = $(Control).children('.ip_TagInput')[0];
        var TagInputTextBox = $(TagInput).children('.ip_TagInputTextBox')[0];

        Control.addTag = function (el, init) {

            if (el == undefined) { el = TagInputTextBox; }

            var tagtext = (typeof (el) == 'object' ? $(el).text() : el);

            if (tagtext == '' || tagtext == undefined || tagtext == null) { return }

            if (tagtext[0] != '#' && options.includeHashTag) { tagtext = '#' + tagtext; }

            if (options.tags.indexOf(tagtext) == -1) {
                $('<div class="ip_TagInputTag">' + tagtext + '<div class="ip_TagInputTagClose">x</div></div>').insertBefore(TagInputTextBox);
                options.tags.push(tagtext);
            }

            if (typeof (el) == 'object') { $(el).text(''); }

            if (!init) { $(Control).trigger('AddTag', { tag: tagtext, tags: options.tags }); }
            if (!init) { $(Control).trigger('change', { tag: tagtext, tags: options.tags, action: 'AddTag' }); }
        }

        Control.removeTag = function (index, tagObj) {

            var tags = $(TagInput).children('.ip_TagInputTag');

            if (index == undefined && tagObj == undefined) { index = tags.length - 1; }
            else if (tagObj != undefined && tagObj != null) { index = $(tags).index(tagObj); }

            var tagtext = $(tags[index]).text();

            $(tags[index]).remove();
            options.tags.splice(index, 1);

            $(Control).trigger('RemoveTag', { tag: tagtext, tags: options.tags });
            $(Control).trigger('change', { tag: tagtext, tags: options.tags, action: 'RemoveTag' });

        }

        Control.val = function () {

            var tags = '';
            for (var i = 0; i < options.tags.length; i++) {

                tags += options.tags[i];
                if (i != options.tags.length - 1) { tags += ','; }

            }
            return tags;
        }

        if (loadTags != null) {
            for (var t = 0; t < loadTags.length; t++) { Control.addTag(loadTags[t].trim(), true); }
        }

        $(Control).unbind('keydown');
        $(Control).unbind('click');
        $(Control).unbind('focus');
        $(Control).unbind('focusout');

        $(Control).on('click', function () {

            ip_CursorPos(TagInputTextBox);

        });
        $(Control).on('keydown', '.ip_TagInputTextBox', function (e) {
            switch (e.keyCode) {
                case 13:
                    Control.addTag(this);
                    return false;
                case 8:
                    var tag = $(this).text();
                    if (tag == '') { Control.removeTag(); }
                    break;
                case 188:
                    Control.addTag(this);
                    return false;
            }
        });
        $(Control).on('click', '.ip_TagInputTagClose', function (e) { Control.removeTag(null, $(this).parent()[0]); });
        $(Control).on('focus', '.ip_TagInputTextBox', function () {
            $(TagInput).find('.ip_TagInputPlaceholder').hide();
        });
        $(Control).on('focusout', '.ip_TagInputTextBox', function () {
            Control.addTag();
            if (options.tags.length == 0 && $(TagInputTextBox).text() == '') { $(TagInput).find('.ip_TagInputPlaceholder').show(); }
        });

        if (options.tags.length != 0) { $(TagInput).find('.ip_TagInputPlaceholder').hide(); }

        Control.options = options;
    }



}

