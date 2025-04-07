import torch
import torch.nn as nn
import torch.nn.functional as F


class UNet(nn.Module):
    def __init__(self):
        super(UNet, self).__init__()

        def CBR(in_channels, out_channels):
            return nn.Sequential(
                nn.Conv2d(in_channels, out_channels, 3, padding=1),
                nn.BatchNorm2d(out_channels),
                nn.ReLU(inplace=True),
            )

        # Encoder
        self.enc1 = CBR(1, 64)
        self.enc2 = CBR(64, 128)
        self.enc3 = CBR(128, 256)

        # Pooling
        self.pool = nn.MaxPool2d(2)

        # Decoder
        self.dec3 = CBR(256 + 128, 128)  # Expect 256 from upsampled + 128 from skip
        self.dec2 = CBR(128 + 64, 64)  # Expect 128 from decoder + 64 from skip
        self.dec1 = nn.Conv2d(64, 1, 1)  # Output channel = 1 mask

    def forward(self, x):
        # Encoder
        e1 = self.enc1(x)  # [B, 64, H, W]
        e2 = self.enc2(self.pool(e1))  # [B, 128, H/2, W/2]
        e3 = self.enc3(self.pool(e2))  # [B, 256, H/4, W/4]

        # Decoder
        d3 = F.interpolate(
            e3, scale_factor=2, mode="bilinear", align_corners=True
        )  # [B, 256, H/2, W/2]
        d3 = torch.cat([d3, e2], dim=1)  # [B, 256+128, H/2, W/2]
        d3 = self.dec3(d3)  # self.dec3 needs to expect 384 channels!

        d2 = F.interpolate(
            d3, scale_factor=2, mode="bilinear", align_corners=True
        )  # [B, _, H, W]
        d2 = torch.cat([d2, e1], dim=1)  # concatenate skip connection
        d2 = self.dec2(d2)  # self.dec2 needs to expect combined channels

        out = torch.sigmoid(self.dec1(d2))  # Output mask
        return out
