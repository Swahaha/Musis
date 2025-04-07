import matplotlib.pyplot as plt
import torch


def show_sample(image_tensor, mask_tensor):
    image = image_tensor.squeeze().numpy()
    mask = mask_tensor.squeeze().numpy()

    plt.figure(figsize=(12, 6))

    plt.subplot(1, 2, 1)
    plt.title("Original Image")
    plt.imshow(image, cmap="gray")
    plt.axis("off")

    plt.subplot(1, 2, 2)
    plt.title("Staff Line Mask")
    plt.imshow(image, cmap="gray")
    plt.imshow(mask, cmap="Reds", alpha=0.5)  # Overlay mask
    plt.axis("off")

    plt.show()
