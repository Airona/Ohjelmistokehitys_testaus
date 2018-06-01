package fi.swd.projektityo.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import fi.swd.projektityo.domain.User;
import fi.swd.projektityo.domain.UserRepository;

/**
 * This class is used by spring security to authenticate and authorize user
 **/
@Service
public class UserDetailServiceImpl implements UserDetailsService  {
	private UserRepository repository;
	
	@Autowired
	public UserDetailServiceImpl(UserRepository userRepository) {
		this.repository = userRepository;
	}
	
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    	  
    	        User user = repository.findByUsername(username);
    	        if (user == null) {
    	            throw new UsernameNotFoundException(
    	              "No user found with username: " + username);
    	        }
    	        boolean enabled = true;
    	        boolean accountNonExpired = true;
    	        boolean credentialsNonExpired = true;
    	        boolean accountNonLocked = true;
    	        return  new org.springframework.security.core.userdetails.User
    	          (
	        		  user.getEmail(),
	        		  user.getPasswordHash(),
	        		  enabled,
	        		  accountNonExpired, 
	        		  credentialsNonExpired,
	        		  accountNonLocked, 
	        		  AuthorityUtils.createAuthorityList(user.getRole())
        		  );
    	    }
    
    	    /*private static List<GrantedAuthority> getAuthorities (List<String> roles) {
    	        List<GrantedAuthority> authorities = new ArrayList<>();
    	        for (String role : roles) {
    	            authorities.add(new SimpleGrantedAuthority(role));
    	        }
    	        return authorities;
    	    }*/
    
	/*
	@Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {   
    	User curruser = repository.findByUsername(username);
        UserDetails user = new org.springframework.security.core.userdetails.User(username, curruser.getPasswordHash(), 
        		AuthorityUtils.createAuthorityList(curruser.getRole()));
        return user;
    }
    */
    
} 