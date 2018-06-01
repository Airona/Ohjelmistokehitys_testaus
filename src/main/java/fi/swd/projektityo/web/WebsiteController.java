package fi.swd.projektityo.web;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.multipart.MultipartFile;

import fi.swd.projektityo.domain.CloudStorageHelper;
import fi.swd.projektityo.domain.Image;
import fi.swd.projektityo.domain.ImageRepository;
import fi.swd.projektityo.domain.User;
import fi.swd.projektityo.domain.UserRepository;

@Controller
public class WebsiteController {
	
	@Autowired
	private ImageRepository irepository;
	@Autowired
	private UserRepository urepository;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	private CloudStorageHelper firebase = new CloudStorageHelper();

//requests SPRING SECURITY
    @RequestMapping(value = "/login")
    public String login() {
        return "/login";
    }    
    @RequestMapping(value = "/signup", method = RequestMethod.GET)
    public String showRegistrationForm(WebRequest request, Model model) {
        UserDto userDto = new UserDto();
        model.addAttribute("user", userDto);
        return "signup";
    }
    @RequestMapping(value = "/signup", method = RequestMethod.POST)
    public String registerUserAccount
          (@ModelAttribute("user") @Valid UserDto accountDto, 
          BindingResult result, WebRequest request, Errors errors, Model model)
    {
    	boolean registerSuccess = false; 
    	if (!result.hasErrors()) {
        	registerSuccess = registerNewUserAccount(accountDto);            
        }
        
        if (result.hasErrors() || !registerSuccess) {
        	model.addAttribute("nameTaken","Use different username");
        	return "signup";
        } 
        else { //TODO, give username to loginpage
        	return "login";
        }
    }
    
    private boolean registerNewUserAccount(UserDto accountDto) { //TODO, move to services
    	if (userExist(accountDto.getUsername())) {
    		System.out.println("username used");
    		return false;
    	}else if (emailExist(accountDto.getEmail())) {
			//throw new EmailExistsException("There is an account with that email address: " + accountDto.getEmail());
    		System.out.println("email registered");
			return false;
		}else {
			final User user = new User();
			user.setUsername(accountDto.getUsername());
			user.setPasswordHash(passwordEncoder.encode(accountDto.getPassword()));
			user.setEmail(accountDto.getEmail());
			user.setRole("ROLE_USER");
			urepository.save(user);
			return true;
		}
    }
    private boolean emailExist(String email) {
		User user = null;
        try {
        	user = urepository.findByEmail(email);			
		} catch (Exception e) {
			e.printStackTrace();
		}
        
        if (user != null) {
            return true;
        }
        return false;
    }
    private boolean userExist(String username) {
		User user = null;
        try {
        	user = urepository.findByUsername(username);			
		} catch (Exception e) {
			e.printStackTrace();
		}
        
        if (user != null) {
            return true;
        }
        return false;
    }
    
//Image upload request
    @RequestMapping(value="/upload", method=RequestMethod.POST)
    public @ResponseBody Image handleFileUpload(@RequestParam("name") String name, @RequestParam("file") MultipartFile file, HttpServletRequest httpServletRequest){
    	Image additionalInformation = firebase.uploadFile(file, name);
    	
    	//username from request
    	String username = null;
		try {username = httpServletRequest.getRemoteUser();
		} catch (Exception e) {}
		if (username == null){
			System.out.println(username);
			username = "guest";// :D
		}
		
		additionalInformation.setUser(username);
		return additionalInformation;
    }

//React catch
	//@RequestMapping(value = {"*"}, method = RequestMethod.GET)
    @RequestMapping(value = {"", "browse", "upload", "manage"}, method = RequestMethod.GET)
  	public String index(HttpServletRequest httpServletRequest) {
  		return "/index";
	}

}