import $ from 'jquery';
import AjaxForm from 'ajax/form';
import Blocker from 'ajax/block';
import jsonHandler from './ajaxJsonResult';
import {generate as preloader} from 'loader/preloader';

export default function (componentService) {
    AjaxForm.defaultOptions.applyResult = function(instance, isSuccess, content) {
        if (typeof content === 'string') {
            var $result = $(content);
            componentService.upgrade($result[0]);
            $result.each(function() {
                componentService.upgrade(this);
            });
            if (instance.$container.is('[modal-animation-container]')) {
                $result = $(instance.$container.closest('modal')[0].appendSecondary($result));
            } else {
                instance.$container.append($result);
            }
            $result.hide();
            return $result;
        } else if (instance.options.dataType == 'json') {
            return jsonHandler(instance, isSuccess, content);
        }
    };
    Blocker.defaultOptions.decorate = function(container) {
        preloader(container)
    };
}