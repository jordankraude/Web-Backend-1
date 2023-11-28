const form = document.querySelector("#inventoryForm")
    form.addEventListener("change", function () {
      const updateInput = form.querySelector("input[type='submit']");
      updateInput.removeAttribute("disabled")
    })