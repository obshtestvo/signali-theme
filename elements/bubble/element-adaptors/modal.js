import $ from 'jquery';

export default function ($container) {
    $(document).on("mfpOpen", function() {
        $container.css('right', $('html').css('margin-right'))
    });
    $(document).on("mfpClose", function() {
        $container.css('right', 0)
    })
}