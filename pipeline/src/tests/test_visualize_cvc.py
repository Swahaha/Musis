from musis.data.loader import CVCMuscimaDataset
from musis.data.visualize import show_sample

from torch.utils.data import DataLoader
import torchvision.transforms as T

transform = T.Compose([T.Resize((512, 512)), T.ToTensor()])

dataset = CVCMuscimaDataset(
    root_dir="data/raw/CVC-MUSCIMA/CvcMuscima-Distortions/ideal", transform=transform
)
dataloader = DataLoader(dataset, batch_size=1, shuffle=True)

for image, mask in dataloader:
    show_sample(image, mask)
    break
