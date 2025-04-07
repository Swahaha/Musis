import os
from torch.utils.data import Dataset
from PIL import Image
import torchvision.transforms as transforms


class CVCMuscimaDataset(Dataset):
    def __init__(self, root_dir, transform=None):
        self.root_dir = root_dir
        self.writers = sorted(
            [
                d
                for d in os.listdir(self.root_dir)
                if os.path.isdir(os.path.join(self.root_dir, d))
            ]
        )

        self.transform = transform

        self.samples = []
        for writer in self.writers:
            writer_dir = os.path.join(self.root_dir, writer)
            image_dir = os.path.join(writer_dir, "image")
            gt_dir = os.path.join(writer_dir, "gt")

            image_files = sorted(os.listdir(image_dir))

            for img_file in image_files:
                img_path = os.path.join(image_dir, img_file)
                gt_path = os.path.join(gt_dir, img_file)

                self.samples.append((img_path, gt_path))

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        img_path, gt_path = self.samples[idx]

        image = Image.open(img_path).convert("L")  # Grayscale
        gt = Image.open(gt_path).convert("L")  # Grayscale mask

        if self.transform:
            image = self.transform(image)
            gt = self.transform(gt)

        return image, gt
