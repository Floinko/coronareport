package quarano.tracking.web;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import quarano.tracking.EmailAddress;
import quarano.tracking.PhoneNumber;
import quarano.tracking.ZipCode;

import java.time.LocalDate;
import java.time.LocalDateTime;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Past;
import javax.validation.constraints.Pattern;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientDto {

	private String clientCode;

	private @NotEmpty String surename;
	private @NotEmpty String firstname;
	private @NotEmpty String street;
	private String houseNumber;
	private @NotEmpty String city;
	private @NotEmpty @Pattern(regexp = ZipCode.PATTERN) String zipCode;
	private @Pattern(regexp = PhoneNumber.PATTERN) String mobilephone;
	private @Pattern(regexp = PhoneNumber.PATTERN) String phone;
	private @NotEmpty @Pattern(regexp = EmailAddress.PATTERN) String email;
	private @NotNull @Past LocalDate dateOfBirth;

	private LocalDateTime quarantineStartDateTime;
	private LocalDateTime quarantineEndDateTime;

	private boolean infected;

	private ClientType type;
}
