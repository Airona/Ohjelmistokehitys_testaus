package fi.swd.projektityo.web;

import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

import fi.swd.projektityo.domain.validation.PasswordMatches;
import fi.swd.projektityo.domain.validation.ValidEmail;

@PasswordMatches
public class UserDto {
	@NotNull
    @NotEmpty
	private String username;
	
	@NotNull
    @NotEmpty
	private String password;
	private String matchingPassword;
	
	@ValidEmail
	@NotNull
    @NotEmpty
	private String email;

	public UserDto() {
		super();
	}

	public UserDto(String username, String password, String matchingPassword,
			String email) {
		super();
		this.username = username;
		this.password = password;
		this.matchingPassword = matchingPassword;
		this.email = email;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getMatchingPassword() {
		return matchingPassword;
	}

	public void setMatchingPassword(String matchingPassword) {
		this.matchingPassword = matchingPassword;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	@Override
	public String toString() {
		return "Register [username=" + username + ", password=" + password
				+ ", matchingPassword=" + matchingPassword + ", email=" + email
				+ "]";
	}
}
