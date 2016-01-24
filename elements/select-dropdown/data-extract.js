import $ from 'jquery';

export default function ($values) {
    var groups = [];
    var selected = [];
    var initial = [];
    var choices = $values.map(function () {
        if (!this.id) this.id = 'select-dropdown-' + Math.floor(Math.random() * 1000) + '-' + Date.now();
        var item = {id: this.id, value: this.id, title: $(this).text()};
        if (this.hasAttribute('group')) {
            var group = this.getAttribute('group');
            item.group = group;
            groups.push({value: group, label: group})
        }
        if (this.hasAttribute('prefix')) {
            item.prefix = this.getAttribute('prefix');
        }
        if (this.hasAttribute('current')) {
            item['class'] = 'current';
        }
        if (this.hasAttribute('class')) {
            item['class'] = this.getAttribute('class');
        }
        if (this.hasAttribute('href')) {
            item.href = this.getAttribute('href');
        }
        if (this.hasAttribute('suffix')) {
            item.suffix = this.getAttribute('suffix');
        }
        if (this.hasAttribute('input')) {
            item.input = this.getAttribute('input');
            item.id = this.getAttribute('site-wide-id')
        }
        if (this.hasAttribute('selected')) {
            selected.push(item.id);
            initial.push(item);
        }
        return item
    }).get();

    return {
        groups: groups,
        choices: choices,
        initial: initial,
        selected: selected
    }
}