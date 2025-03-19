const QRCode = require("qrcode");
const elxyzFile = require("./elxyzFile");

function convertCRC16(str) {
  let crc = 0xffff;
  const strlen = str.length;

  for (let c = 0; c < strlen; c++) {
    crc ^= str.charCodeAt(c) << 8;
    for (let i = 0; i < 8; i++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
  }

  let hex = crc & 0xffff;
  return ("000" + hex.toString(16).toUpperCase()).slice(-4);
}

const generateQRIS = async (codeqr) => {
  try {
    let qrisData = codeqr;
    qrisData = qrisData.slice(0, -4);
    const step1 = qrisData.replace("010211", "010212");
    const step2 = step1.split("5802ID");
    const result = step2[0] + "5802ID" + step2[1] + convertCRC16(step2[0] + "5802ID" + step2[1]);

    // Simpan QR ke buffer (tidak ke file lokal)
    const qrBuffer = await QRCode.toBuffer(result);

    // Upload QR langsung dari buffer
    const uploadedFile = await elxyzFile(qrBuffer, "qr_image.png");

    return { qrImageUrl: uploadedFile.fileUrl };
  } catch (error) {
    console.error("Error generating and uploading QR code:", error);
    throw error;
  }
};

module.exports = generateQRIS;
