package com.ats.api.profile.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateResumeTitleRequest {

    @NotBlank(message = "Tên gợi nhớ cho CV không được để trống")
    @Size(max = 150, message = "Tên gợi nhớ cho CV tối đa 150 ký tự")
    private String title;
}
