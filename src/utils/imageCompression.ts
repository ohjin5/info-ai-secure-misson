/**
 * Browser Canvas를 이용해 이미지를 압축한 뒤
 * Google Apps Script로 전송 가능한
 * JPEG Data URL 형태로 반환한다.
 *
 * 반환 예:
 * data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ...
 */
export async function compressImage(
  file: File,
  maxDimension = 1600,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(
        new Error(
          "이미지 파일이 없습니다."
        )
      );
      return;
    }

    if (
      !file.type ||
      !file.type.startsWith("image/")
    ) {
      reject(
        new Error(
          "이미지 파일만 등록할 수 있습니다."
        )
      );
      return;
    }

    const reader =
      new FileReader();

    reader.onerror = () => {
      reject(
        new Error(
          "이미지 파일을 읽는 중 오류가 발생했습니다."
        )
      );
    };

    reader.onload = (event) => {
      const result =
        event.target?.result;

      if (
        !result ||
        typeof result !== "string"
      ) {
        reject(
          new Error(
            "이미지 데이터를 읽을 수 없습니다."
          )
        );
        return;
      }

      const img =
        new Image();

      img.onerror = () => {
        reject(
          new Error(
            "이미지를 불러올 수 없습니다."
          )
        );
      };

      img.onload = () => {
        let width =
          img.naturalWidth ||
          img.width;

        let height =
          img.naturalHeight ||
          img.height;

        if (
          !width ||
          !height
        ) {
          reject(
            new Error(
              "이미지 크기를 확인할 수 없습니다."
            )
          );
          return;
        }

        /**
         * 긴 변 기준 최대 maxDimension
         */
        if (
          width > maxDimension ||
          height > maxDimension
        ) {
          const scale =
            Math.min(
              maxDimension /
                width,
              maxDimension /
                height
            );

          width =
            Math.round(
              width * scale
            );

          height =
            Math.round(
              height * scale
            );
        }

        /**
         * 너무 작은 이미지 방지
         */
        if (
          width < 50 ||
          height < 50
        ) {
          reject(
            new Error(
              "이미지 크기가 너무 작습니다. 다른 사진을 선택해주세요."
            )
          );
          return;
        }

        const canvas =
          document.createElement(
            "canvas"
          );

        canvas.width =
          width;

        canvas.height =
          height;

        const ctx =
          canvas.getContext(
            "2d"
          );

        if (!ctx) {
          reject(
            new Error(
              "이미지 처리 기능을 사용할 수 없습니다."
            )
          );
          return;
        }

        /**
         * JPEG 변환 시 투명 PNG 등의
         * 배경이 검정색으로 바뀌지 않도록
         * 흰색 배경 먼저 채움
         */
        ctx.fillStyle =
          "#FFFFFF";

        ctx.fillRect(
          0,
          0,
          width,
          height
        );

        ctx.drawImage(
          img,
          0,
          0,
          width,
          height
        );

        let dataUrl:
          string;

        try {
          dataUrl =
            canvas.toDataURL(
              "image/jpeg",
              quality
            );
        } catch (error) {
          console.error(
            "Canvas toDataURL error:",
            error
          );

          reject(
            new Error(
              "이미지를 변환하는 중 오류가 발생했습니다."
            )
          );
          return;
        }

        if (
          !dataUrl ||
          !dataUrl.startsWith(
            "data:image/jpeg;base64,"
          )
        ) {
          reject(
            new Error(
              "압축된 이미지 형식이 올바르지 않습니다."
            )
          );
          return;
        }

        resolve(
          dataUrl
        );
      };

      img.src =
        result;
    };

    reader.readAsDataURL(
      file
    );
  });
}