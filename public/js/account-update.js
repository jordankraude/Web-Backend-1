const form = document.querySelector(".accountForm")
    form.addEventListener("change", function () {
      const updateInput = form.querySelector("input[type='submit']");
      updateInput.removeAttribute("disabled")
    })