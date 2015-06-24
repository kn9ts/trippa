var Typing = function(elem, data) {
    this.elem = elem || document;
    this.data = data || [];
}

Typing.prototype = {
    supervise: function() {
        document.getElementById(this.elem).keypress = this.followAlong;
    },
    followAlong: function(ev) {}

}

// (((words_typed / 5) * 60) / time_taken)

// $('#typing-field').keypress(function(event) {
//     var w_Code = window.event;
//     if ([8, 46].indexOf(event.which) > -1) {
//         console.log('backspace', event.which)
//         event.preventDefault();
//         return false;
//     } else {
//         console.log(event.which, w_Code.charCode)
//     }
//     return true;
// });
