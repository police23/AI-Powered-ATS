package com.ats.api.profile.dto.request;

import com.ats.api.profile.entity.ExperienceLevel;
import com.ats.api.profile.entity.Gender;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {

    @NotBlank(message = "Họ và tên không được để trống")
    @Size(min = 2, max = 100, message = "Họ và tên phải từ 2 đến 100 ký tự")
    private String fullName;

    @Pattern(regexp = "^$|^(0|\\+84)[3|5|7|8|9][0-9]{8}$", message = "Số điện thoại không đúng định dạng")
    private String phoneNumber;

    @Size(max = 50, message = "Tỉnh/Thành phố không vượt quá 50 ký tự")
    private String city;

    @Past(message = "Ngày sinh phải là ngày trong quá khứ")
    private LocalDate dateOfBirth;

    private Gender gender;

    @Size(max = 100, message = "Nghề nghiệp chuyên môn không vượt quá 100 ký tự")
    private String jobTitle;

    private ExperienceLevel experienceLevel;
}
