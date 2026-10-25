(function () {
  'use strict';

  var form = document.getElementById('apply-form');
  var status = document.getElementById('status');
  var submit = document.getElementById('submit');
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  if (!form) return;

  var rules = {
    name: function (v) { return v.length >= 2 ? '' : 'Enter your full name.'; },
    email: function (v) {
      if (!v) return 'Enter your email address.';
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address, like name@example.com.';
    },
    location: function (v) { return v.length >= 2 ? '' : 'Tell us where you are based.'; },
    watch: function (v) { return v ? '' : 'Choose your watch model.'; },
    background: function (v) {
      return v.length >= 40 ? '' : 'Give us a little more detail (' + v.length + '/40 characters).';
    },
    motivation: function (v) {
      return v.length >= 80 ? '' : 'Tell us more, in at least 80 characters (' + v.length + '/80).';
    }
  };

  function check(field) {
    var el = form.elements[field];
    var msg = rules[field](el.value.trim());
    var err = document.getElementById(field + '-err');
    err.textContent = msg;
    err.hidden = !msg;
    if (msg) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
    return msg;
  }

  Object.keys(rules).forEach(function (f) {
    var el = form.elements[f];
    el.addEventListener('blur', function () { check(f); });
    el.addEventListener('input', function () {
      if (el.getAttribute('aria-invalid')) check(f);
    });
  });

  var motivation = form.elements.motivation;
  var count = document.getElementById('motivation-count');
  motivation.addEventListener('input', function () { count.textContent = motivation.value.length; });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.className = 'status';
    var first = null;
    Object.keys(rules).forEach(function (f) {
      if (check(f) && !first) first = form.elements[f];
    });
    if (first) {
      status.textContent = 'Please fix the highlighted fields.';
      first.focus();
      return;
    }

    // TODO(follow-up): POST to a real backend / form service here.
    // This prototype only simulates a submit; nothing leaves the browser.
    submit.disabled = true;
    status.textContent = 'Checking your application…';
    setTimeout(function () {
      submit.disabled = false;
      status.className = 'status ok';
      status.textContent = 'Prototype only: your answers passed validation but were not sent or stored.';
    }, 700);
  });
})();
