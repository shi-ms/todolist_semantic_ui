$('input[type=checkbox]').on("click", function(){
        if (!$(this).prop("checked")){
            $(this).removeAttr("checked");
        } else {
            $(this).attr("checked", "checked");
        }
        $(this).next("label").toggleClass("completed");
});

