import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
import torchvision.transforms as T

from musis.data.loader import CVCMuscimaDataset
from musis.models.unet import UNet


def train():
    # Configs
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    epochs = 10
    batch_size = 4
    lr = 1e-3

    # Data
    transform = T.Compose(
        [
            T.Resize((512, 512)),
            T.ToTensor(),
        ]
    )

    dataset = CVCMuscimaDataset(
        root_dir="data/raw/CVC-MUSCIMA/CvcMuscima-Distortions/ideal",
        transform=transform,
    )
    dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=True)

    # Model
    model = UNet().to(device)

    # Loss + Optimizer
    criterion = nn.BCELoss()
    optimizer = optim.Adam(model.parameters(), lr=lr)

    # Training loop
    for epoch in range(epochs):
        model.train()
        running_loss = 0.0

        for images, masks in dataloader:
            images, masks = images.to(device), masks.to(device)

            # Forward pass
            outputs = model(images)
            loss = criterion(outputs, masks)

            # Backward and optimize
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

            running_loss += loss.item()

        avg_loss = running_loss / len(dataloader)
        print(f"Epoch [{epoch+1}/{epochs}], Loss: {avg_loss:.4f}")

        # Save model checkpoint every epoch
        torch.save(model.state_dict(), f"model_epoch_{epoch+1}.pth")


if __name__ == "__main__":
    train()
