$(document).ready(function() {



    $('.lang span').on('click', function() {
        $('.lang ul').slideToggle();
    });

    checkbox();


    $('.link-modal').on('click', function() {
        $('body').css('overflow-y','hidden');
        $('.overlay').fadeIn( "fast", function() {
            $('#modal').fadeIn("fast");
        });
    });

    $('.btn-close-modal').on('click', function() {
        $('body').css('overflow-y','auto');
        $('#modal').fadeOut( "fast", function() {
            $('.overlay').fadeOut("fast");
        });
    });

});




if(navigator.appVersion.indexOf("MSIE 8.")!=-1) {
// To test the @id toggling on password inputs in browsers that don’t support changing an input’s @type dynamically (e.g. Firefox 3.6 or IE), uncomment this:
// $.fn.hide = function() { return this; }
// Then uncomment the last rule in the <style> element (in the <head>).
    $(function () {
        // Invoke the plugin
        $('input, textarea').placeholder({customClass: 'my-placeholder'});
        // That’s it, really.

        var html;

        if ($.fn.placeholder.input && $.fn.placeholder.textarea) {
            html = '<strong>Your current browser natively supports <code>placeholder</code> for <code>input</code> and <code>textarea</code> elements.</strong> The plugin won’t run in this case, since it’s not needed. If you want to test the plugin, use an older browser.';
        } else if ($.fn.placeholder.input) {
            html = '<strong>Your current browser natively supports <code>placeholder</code> for <code>input</code> elements, but not for <code>textarea</code> elements.</strong> The plugin will only do its thang on the <code>textarea</code>s.';
        }

        if (html) {
            $('<p class="note">' + html + '</p>').insertBefore('form');
        }
    });
}

/*=============================================== checkbox ===============================================*/
function checkbox() {

    $(".check").each(function(){
        $(this).find("input").after('<span class="checkbox"></span>');
    });


    var element = $(".checkbox");

    $(".check").each(function(i) {
        var self = this;
        var myElement = $('.checkbox').eq(i);

        $(self).click(function() {

            var checkbox = $(self).find(".checkbox");
            var input = $(self).find("input");

            // cambiar clase
            if(input.is(":checked")){

                input.prop("checked", false);
                checkbox.removeClass("active");

            }else{

                input.prop("checked", true);
                checkbox.addClass("active");
                $(self).removeClass("error");

            }

            return false;

        });

    });
}
/*=============================================== end checkbox ===============================================*/